// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24; 

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract UITShareDocs is ERC1155, ERC2981, Ownable {
    using Strings for uint256;

    uint256 private _tokenIdCounter;
    uint256 public constant MAX_SUPPLY_LIMIT = 1000; 

    mapping(uint256 => address) public creators;
    mapping(uint256 => uint256) public totalSupply;
    mapping(uint256 => string) private _tokenURIs; 

    // KHAI BÁO EVENT (Fix lỗi số 5)
    event DocumentMinted(uint256 indexed tokenId, address indexed creator, uint256 amount, string tokenURI);
    event DocumentBurned(uint256 indexed tokenId, address indexed burner, uint256 amount);

    constructor() ERC1155("") Ownable(msg.sender) {}

    function mint(uint256 amount_, string memory tokenURI_, bytes memory data_) 
        public 
        returns (uint256) 
    {
        // VALIDATE (Fix lỗi số 3)
        require(amount_ > 0 && amount_ <= MAX_SUPPLY_LIMIT, "Invalid amount");
        require(bytes(tokenURI_).length > 0, "URI cannot be empty");

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        creators[tokenId] = msg.sender;
        totalSupply[tokenId] = amount_;
        _tokenURIs[tokenId] = tokenURI_;

        _mint(msg.sender, tokenId, amount_, data_);
        
        emit DocumentMinted(tokenId, msg.sender, amount_, tokenURI_);
        return tokenId;
    }

    function burn(address account, uint256 id, uint256 value) public {
        // KIỂM TRA TỒN TẠI (Fix lỗi số 4 trong burn)
        require(creators[id] != address(0), "Token does not exist");
        require(
            account == msg.sender || isApprovedForAll(account, msg.sender),
            "Not owner nor approved"
        );
        // KIỂM TRA SỐ DƯ (Fix lỗi số 1 - Chuyển Panic thành Revert reason)
        require(balanceOf(account, id) >= value, "Burn amount exceeds balance");

        totalSupply[id] -= value;
        _burn(account, id, value);
        
        emit DocumentBurned(id, account, value);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        // KIỂM TRA TỒN TẠI (Fix lỗi số 4)
        require(creators[tokenId] != address(0), "URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    // FIX LỖI SỐ 2: Khai báo các Interface hỗ trợ
    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        override(ERC1155, ERC2981) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter;
    }
}