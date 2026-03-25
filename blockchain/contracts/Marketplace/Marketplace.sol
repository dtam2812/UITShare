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

    struct Order {
        address seller;
        uint256 tokenId;
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
    }
}