// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";

contract UITShareMarketplace is Ownable, ReentrancyGuard {
    using ERC165Checker for address;

    struct Order {
        address seller;
        uint256 tokenId;
        uint256 amount;
        uint256 price;
        bool active;
    }

    mapping(uint256 => Order) public orders;
    uint256 private orderIdCount = 1;

    IERC1155 public immutable nftContract;
    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    uint256 public feeRate;
    uint256 public constant FEE_DENOMINATOR = 10000;
    address public feeRecipient;

    event OrderAdded(uint256 indexed orderId, address indexed seller, uint256 indexed tokenId, uint256 amount, uint256 price);
    event OrderCancelled(uint256 indexed orderId);
    event OrderMatched(uint256 indexed orderId, address indexed seller, address indexed buyer, uint256 price, uint256 marketplaceFee, uint256 royaltyAmount);
    event TransferWithRoyalty(address indexed from, address indexed to, uint256 indexed tokenId, uint256 amount, uint256 royaltyAmount);
    event Donated(address indexed donor, address indexed recipient, uint256 amount);
    event FeeRateUpdated(uint256 newRate);
    event FeeRecipientUpdated(address indexed newRecipient);

    constructor(address nftAddress_, uint256 feeRate_, address feeRecipient_) Ownable(msg.sender) {
        require(nftAddress_ != address(0), "Invalid NFT address");
        require(feeRecipient_ != address(0), "Invalid fee recipient");
        require(feeRate_ <= 2000, "Fee too high");
        nftContract = IERC1155(nftAddress_);
        feeRate = feeRate_;
        feeRecipient = feeRecipient_;
    }

    function addOrder(uint256 tokenId_, uint256 amount_, uint256 price_) external {
        require(amount_ > 0, "Amount > 0");
        require(price_ > 0, "Price > 0");
        require(nftContract.balanceOf(msg.sender, tokenId_) >= amount_, "Insufficient balance");
        require(nftContract.isApprovedForAll(msg.sender, address(this)), "Not approved");

        uint256 _orderId = orderIdCount++;
        orders[_orderId] = Order(msg.sender, tokenId_, amount_, price_, true);
        nftContract.safeTransferFrom(msg.sender, address(this), tokenId_, amount_, "");

        emit OrderAdded(_orderId, msg.sender, tokenId_, amount_, price_);
    }

    function cancelOrder(uint256 orderId_) external nonReentrant {
        Order storage order = orders[orderId_];
        require(order.active && order.seller == msg.sender, "Unauthorized or inactive");

        order.active = false;
        uint256 _tid = order.tokenId;
        uint256 _amt = order.amount;
        delete orders[orderId_];

        nftContract.safeTransferFrom(address(this), msg.sender, _tid, _amt, "");
        emit OrderCancelled(orderId_);
    }

    function executeOrder(uint256 orderId_) external payable nonReentrant {
        Order storage order = orders[orderId_];
        require(order.active, "Order inactive");
        require(msg.value >= order.price, "Insufficient ETH");
        require(order.seller != msg.sender, "Seller cannot buy");

        order.active = false;
        uint256 totalPrice = order.price;

        uint256 marketplaceFee = (totalPrice * feeRate) / FEE_DENOMINATOR;
        uint256 royaltyAmount = 0;
        address author = address(0);

        if (address(nftContract).supportsInterface(_INTERFACE_ID_ERC2981)) {
            (author, royaltyAmount) = IERC2981(address(nftContract)).royaltyInfo(order.tokenId, totalPrice);
        }

        require(totalPrice >= (marketplaceFee + royaltyAmount), "Fees exceed price");

        address _seller = order.seller;
        uint256 _tokenId = order.tokenId;
        uint256 _amount = order.amount;
        delete orders[orderId_];

        _sendValue(feeRecipient, marketplaceFee);
        _sendValue(author, royaltyAmount);
        _sendValue(_seller, totalPrice - marketplaceFee - royaltyAmount);

        if (msg.value > totalPrice) {
            _sendValue(msg.sender, msg.value - totalPrice);
        }

        nftContract.safeTransferFrom(address(this), msg.sender, _tokenId, _amount, "");
        emit OrderMatched(orderId_, _seller, msg.sender, totalPrice, marketplaceFee, royaltyAmount);
    }

    function transferWithRoyalty(
        address to_,
        uint256 tokenId_,
        uint256 amount_,
        uint256 transferValue_
    ) external payable nonReentrant {
        require(to_ != address(0), "Invalid recipient");
        require(to_ != msg.sender, "Cannot transfer to self");
        require(amount_ > 0, "Amount must be > 0");
        require(
            nftContract.balanceOf(msg.sender, tokenId_) >= amount_,
            "Insufficient balance"
        );
        require(
            nftContract.isApprovedForAll(msg.sender, address(this)),
            "Not approved"
        );

        uint256 royaltyAmount = 0;
        address author = address(0);

        if (address(nftContract).supportsInterface(_INTERFACE_ID_ERC2981)) {
            (author, royaltyAmount) = IERC2981(address(nftContract))
                .royaltyInfo(tokenId_, transferValue_);
        }

        require(msg.value >= royaltyAmount, "Insufficient ETH for royalty");

        uint256 refund = msg.value - royaltyAmount;

        _sendValue(author, royaltyAmount);

        if (refund > 0) {
            _sendValue(msg.sender, refund);
        }

        nftContract.safeTransferFrom(msg.sender, to_, tokenId_, amount_, "");

        emit TransferWithRoyalty(msg.sender, to_, tokenId_, amount_, royaltyAmount);
    }


    function donate() external payable {
        require(msg.value > 0, "Must send ETH");
        emit Donated(msg.sender, address(this), msg.value);
    }

    function donateToSeller(address seller_) external payable nonReentrant {
        require(msg.value > 0, "Must send ETH");
        require(seller_ != address(0), "Invalid seller address");
        _sendValue(seller_, msg.value);
        emit Donated(msg.sender, seller_, msg.value);
    }

    function donateToAuthor(uint256 tokenId_) external payable nonReentrant {
        require(msg.value > 0, "Must send ETH");
        address author;
        if (address(nftContract).supportsInterface(_INTERFACE_ID_ERC2981)) {
            (author, ) = IERC2981(address(nftContract)).royaltyInfo(tokenId_, msg.value);
        }
        require(author != address(0), "Author not found");
        _sendValue(author, msg.value);
        emit Donated(msg.sender, author, msg.value);
    }

    function withdrawFunds() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Transfer failed");
    }

    function setFeeRate(uint256 newRate_) external onlyOwner {
        require(newRate_ <= 2000, "Fee too high");
        feeRate = newRate_;
        emit FeeRateUpdated(newRate_);
    }

    function setFeeRecipient(address newRecipient_) external onlyOwner {
        require(newRecipient_ != address(0), "Invalid address");
        feeRecipient = newRecipient_;
        emit FeeRecipientUpdated(newRecipient_);
    }

    function getRoyaltyInfo(
        uint256 tokenId_,
        uint256 transferValue_
    ) external view returns (address author, uint256 royaltyAmount) {
        if (address(nftContract).supportsInterface(_INTERFACE_ID_ERC2981)) {
            (author, royaltyAmount) = IERC2981(address(nftContract))
                .royaltyInfo(tokenId_, transferValue_);
        }
    }

    function _sendValue(address recipient, uint256 amount) internal {
        if (amount > 0 && recipient != address(0)) {
            (bool success, ) = payable(recipient).call{value: amount}("");
            require(success, "Transfer failed");
        }
    }

    receive() external payable {
        if (msg.value > 0) emit Donated(msg.sender, address(this), msg.value);
    }

    function onERC1155Received(
        address, address, uint256, uint256, bytes memory
    ) public pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address, address, uint256[] memory, uint256[] memory, bytes memory
    ) public pure returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}