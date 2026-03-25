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

    // Mapping from Order ID to Order details
    mapping(uint256 => Order) public orders;
    uint256 private orderIdCount = 1;
    
    IERC1155 public immutable nftContract;
    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    uint256 public feeRate;      
    uint256 public constant FEE_DENOMINATOR = 10000;
    address public feeRecipient;

    // Events 
    event OrderAdded(uint256 indexed orderId, address indexed seller, uint256 indexed tokenId, uint256 amount, uint256 price);
    event OrderCancelled(uint256 indexed orderId);
    
    // Emits detailed cash flow information for transparency
    event OrderMatched(
        uint256 indexed orderId, 
        address indexed seller, 
        address indexed buyer, 
        uint256 price, 
        uint256 marketplaceFee, 
        uint256 royaltyAmount
    );

    constructor(address nftAddress_, uint256 feeRate_, address feeRecipient_) Ownable(msg.sender) {
        require(nftAddress_ != address(0), "Invalid NFT address");
        nftContract = IERC1155(nftAddress_);
        feeRate = feeRate_;
        feeRecipient = feeRecipient_;
    }

    function addOrder(uint256 tokenId_, uint256 amount_, uint256 price_) external {
        require(amount_ > 0, "Amount must be > 0");
        require(price_ > 0, "Price must be > 0");
        
        // VALIDATE NFT BALANCE: Ensure seller owns enough tokens
        require(nftContract.balanceOf(msg.sender, tokenId_) >= amount_, "Insufficient NFT balance");
        require(nftContract.isApprovedForAll(msg.sender, address(this)), "Not approved");

        uint256 _orderId = orderIdCount++;
        orders[_orderId] = Order(msg.sender, tokenId_, amount_, price_, true);

        // Transfer NFT to contract escrow
        nftContract.safeTransferFrom(msg.sender, address(this), tokenId_, amount_, "");
        emit OrderAdded(_orderId, msg.sender, tokenId_, amount_, price_);
    }

    function cancelOrder(uint256 orderId_) external nonReentrant {
        Order storage order = orders[orderId_];
        
        // CHECK ORDER EXISTENCE: Verify the order is valid and active
        require(order.seller != address(0) && order.active, "Order not found or inactive");
        require(order.seller == msg.sender, "Not seller");

        order.active = false;
        uint256 _tid = order.tokenId;
        uint256 _amt = order.amount;
        
        // Delete order from mapping to free up gas and clean state
        delete orders[orderId_]; 
        
        nftContract.safeTransferFrom(address(this), msg.sender, _tid, _amt, "");
        emit OrderCancelled(orderId_);
    }

    function executeOrder(uint256 orderId_) external payable nonReentrant {
        Order storage order = orders[orderId_];
        
        // VALIDATION: Check existence, payment, and prevent self-buying
        require(order.seller != address(0) && order.active, "Order not found or inactive");
        require(msg.value >= order.price, "Insufficient ETH");
        require(order.seller != msg.sender, "Seller cannot buy");

        order.active = false;
        uint256 totalPrice = order.price;

        // Fee & Royalty Calculations 
        uint256 marketplaceFee = (totalPrice * feeRate) / FEE_DENOMINATOR;
        uint256 royaltyAmount = 0;
        address author = address(0);

        // Check if the NFT contract supports ERC2981 Royalties
        if (address(nftContract).supportsInterface(_INTERFACE_ID_ERC2981)) {
            (author, royaltyAmount) = IERC2981(address(nftContract)).royaltyInfo(order.tokenId, totalPrice);
        }

        require(totalPrice >= (marketplaceFee + royaltyAmount), "Fees exceed price");
        uint256 sellerProceeds = totalPrice - marketplaceFee - royaltyAmount;

        // ETH Distribution 
        _sendValue(feeRecipient, marketplaceFee);
        _sendValue(author, royaltyAmount);
        _sendValue(order.seller, sellerProceeds);

        // Refund excess ETH back to the buyer
        if (msg.value > totalPrice) {
            _sendValue(msg.sender, msg.value - totalPrice);
        }

        // Finalize NFT transfer from escrow to buyer
        nftContract.safeTransferFrom(address(this), msg.sender, order.tokenId, order.amount, "");
        
        // LOG TRANSACTION DETAILS
        emit OrderMatched(orderId_, order.seller, msg.sender, totalPrice, marketplaceFee, royaltyAmount);
        
        // Clear storage to prevent double execution and save gas
        delete orders[orderId_];
    }

    function _sendValue(address recipient, uint256 amount) internal {
        if (amount > 0 && recipient != address(0)) {
            (bool success, ) = payable(recipient).call{value: amount}("");
            require(success, "Transfer failed");
        }
    }

    function onERC1155Received(address, address, uint256, uint256, bytes memory) public pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory) public pure returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}