<<<<<<< HEAD
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IDocumentNFT {
    function getCreator(uint256 tokenId) external view returns (address);
}

contract Marketplace1155 is Ownable, ERC1155Holder, ReentrancyGuard {
=======
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";

contract UITShareMarketplace is Ownable, ReentrancyGuard {
    using ERC165Checker for address;
>>>>>>> 0911c5ab3bc1245cca1f048d26fbec846685ae52

    struct Order {
        address seller;
        uint256 tokenId;
<<<<<<< HEAD
        uint256 price;
        uint256 amount;
    }

    uint256 public currentOrderId;
    IDocumentNFT public immutable nftContract;

    mapping(uint256 => Order) public orders;

    uint256 public feeRate;
    uint256 public feeDecimal;
    address public feeRecipient;

    event OrderAdded(uint256 indexed orderId, address indexed seller, uint256 tokenId, uint256 price, uint256 amount);
    event OrderExecuted(uint256 indexed orderId, address indexed buyer, uint256 buyAmount, uint256 totalPrice);
    event OrderCancelled(uint256 indexed orderId);
    event Donated(address indexed donor, address indexed author, uint256 tokenId, uint256 amount);
    event FeeUpdated(uint256 newRate, uint256 newDecimal);
    event FeeRecipientUpdated(address indexed newRecipient);

    constructor(
        address _nftAddress,
        uint256 _feeRate,
        uint256 _feeDecimal,
        address _feeRecipient
    ) {
        require(_nftAddress != address(0), "Invalid NFT address");
        require(_feeRecipient != address(0), "Invalid fee recipient");

        nftContract = IDocumentNFT(_nftAddress);
        feeRate = _feeRate;
        feeDecimal = _feeDecimal;
        feeRecipient = _feeRecipient;
    }

    // ===== ADMIN =====

    function setFee(uint256 _feeRate, uint256 _feeDecimal) external onlyOwner {
        require(_feeRate <= 10 * (10 ** _feeDecimal), "Fee too high");
        feeRate = _feeRate;
        feeDecimal = _feeDecimal;
        emit FeeUpdated(_feeRate, _feeDecimal);
    }

    function setFeeRecipient(address _newRecipient) external onlyOwner {
        require(_newRecipient != address(0), "Invalid address");
        feeRecipient = _newRecipient;
        emit FeeRecipientUpdated(_newRecipient);
    }

    // ===== CORE =====

    function addOrder(uint256 tokenId, uint256 price, uint256 amount) external nonReentrant {
        require(price > 0, "Price must be > 0");
        require(amount > 0, "Amount must be > 0");

        currentOrderId++;

        orders[currentOrderId] = Order({
            seller: msg.sender,
            tokenId: tokenId,
            price: price,
            amount: amount
        });

        IERC1155(address(nftContract)).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId,
            amount,
            ""
        );

        emit OrderAdded(currentOrderId, msg.sender, tokenId, price, amount);
    }

    function cancelOrder(uint256 orderId) external nonReentrant {
        Order storage order = orders[orderId];

        require(order.seller == msg.sender, "Not seller");
        require(order.amount > 0, "Invalid order");

        uint256 amount = order.amount;
        uint256 tokenId = order.tokenId;

        delete orders[orderId];

        IERC1155(address(nftContract)).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId,
            amount,
            ""
        );

        emit OrderCancelled(orderId);
    }

    function executeOrder(uint256 orderId, uint256 buyAmount) external payable nonReentrant {
        Order storage order = orders[orderId];

        require(order.amount >= buyAmount, "Not enough NFT");

        uint256 totalPrice = order.price * buyAmount;
        require(msg.value == totalPrice, "Wrong ETH");

        uint256 fee = (totalPrice * feeRate) / (10 ** (feeDecimal + 2));
        uint256 sellerAmount = totalPrice - fee;

        order.amount -= buyAmount;

        uint256 tokenId = order.tokenId;
        address seller = order.seller;

        if (order.amount == 0) {
            delete orders[orderId];
        }

        IERC1155(address(nftContract)).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId,
            buyAmount,
            ""
        );

        if (fee > 0) {
            (bool successFee, ) = payable(feeRecipient).call{value: fee}("");
            require(successFee, "Fee failed");
        }

        (bool successSeller, ) = payable(seller).call{value: sellerAmount}("");
        require(successSeller, "Seller failed");

        emit OrderExecuted(orderId, msg.sender, buyAmount, totalPrice);
    }

    function donateToAuthor(uint256 tokenId) external payable nonReentrant {
        require(msg.value > 0, "Must donate > 0");

        address author = nftContract.getCreator(tokenId);
        require(author != address(0), "No author");

        (bool success, ) = payable(author).call{value: msg.value}("");
        require(success, "Donate failed");

        emit Donated(msg.sender, author, tokenId, msg.value);
=======
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
    event Donated(address indexed donor, address indexed recipient, uint256 amount);
    event FeeRateUpdated(uint256 newRate);
    event FeeRecipientUpdated(address indexed newRecipient);

    constructor(address nftAddress_, uint256 feeRate_, address feeRecipient_) Ownable(msg.sender) {
        require(nftAddress_ != address(0), "Invalid NFT address");
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
        
        _sendValue(feeRecipient, marketplaceFee);
        _sendValue(author, royaltyAmount);
        _sendValue(order.seller, totalPrice - marketplaceFee - royaltyAmount);

        if (msg.value > totalPrice) {
            _sendValue(msg.sender, msg.value - totalPrice);
        }

        nftContract.safeTransferFrom(address(this), msg.sender, order.tokenId, order.amount, "");
        emit OrderMatched(orderId_, order.seller, msg.sender, totalPrice, marketplaceFee, royaltyAmount);
        delete orders[orderId_];
    }

    function donate() external payable {
        require(msg.value > 0, "Must send ETH");
        emit Donated(msg.sender, address(this), msg.value);
    }

    function donateToSeller(address seller) external payable nonReentrant {
        require(msg.value > 0 && seller != address(0), "Invalid input");
        _sendValue(seller, msg.value);
        emit Donated(msg.sender, seller, msg.value);
    }

    function donateToAuthor(uint256 tokenId) external payable nonReentrant {
        require(msg.value > 0, "Must send ETH");
        address author;
        if (address(nftContract).supportsInterface(_INTERFACE_ID_ERC2981)) {
            (author, ) = IERC2981(address(nftContract)).royaltyInfo(tokenId, msg.value);
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

    function setFeeRate(uint256 newRate) external onlyOwner {
    require(newRate <= 2000, "Fee too high");
    feeRate = newRate;
    
    emit FeeRateUpdated(newRate);
}

    function setFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid address");
        feeRecipient = newRecipient;
    
        emit FeeRecipientUpdated(newRecipient);
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

    function onERC1155Received(address, address, uint256, uint256, bytes memory) public pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory) public pure returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
>>>>>>> 0911c5ab3bc1245cca1f048d26fbec846685ae52
    }
}