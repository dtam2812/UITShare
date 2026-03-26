// SPDX-License-Identifier: UNLICENSED
<<<<<<< HEAD
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DocumentNFT is ERC1155, Ownable {

    uint256 private _tokenIdCounter;
    string private _baseTokenURI;

    // lưu creator cho marketplace (donate)
    mapping(uint256 => address) public creators;

    constructor()
        ERC1155("")
    {}

    // ===== MINT =====
    function mint(address to_, uint256 amount_) 
        public 
        onlyOwner 
        returns (uint256) 
    {
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        _mint(to_, tokenId, amount_, "");

        // lưu người tạo
        creators[tokenId] = msg.sender;

        return tokenId;
    }

    // ===== URI =====
    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(_baseTokenURI, _toString(tokenId), ".json"));
    }

    function updateBaseTokenURI(string memory baseTokenURI_) 
        public 
        onlyOwner 
    {
        _baseTokenURI = baseTokenURI_;
    }

    // ===== MARKETPLACE SUPPORT =====
    function getCreator(uint256 tokenId) external view returns (address) {
        return creators[tokenId];
    }

    // ===== INTERNAL =====
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
=======
pragma solidity ^0.8.24; 

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract UITShareNFT is ERC1155, ERC2981, Ownable {
    using Strings for uint256;

    uint256 private _tokenIdCounter;
    uint256 public constant MAX_SUPPLY_LIMIT = 1000; 

    mapping(uint256 => address) public creators;
    mapping(uint256 => uint256) public totalSupply;
    mapping(uint256 => string) private _tokenURIs; 

    event DocumentMinted(uint256 indexed tokenId, address indexed creator, uint256 amount, string tokenURI);
    event DocumentBurned(uint256 indexed tokenId, address indexed burner, uint256 amount);

    constructor() ERC1155("") Ownable(msg.sender) {}

    function mint(uint256 amount_, string memory tokenURI_, bytes memory data_) 
        public 
        returns (uint256) 
    {
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
    
        require(creators[id] != address(0), "Token does not exist");
        require(
            account == msg.sender || isApprovedForAll(account, msg.sender),
            "Not owner nor approved"
        );
        require(balanceOf(account, id) >= value, "Burn amount exceeds balance");

        totalSupply[id] -= value;
        _burn(account, id, value);
        
        emit DocumentBurned(id, account, value);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {

        require(creators[tokenId] != address(0), "URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

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
>>>>>>> 0911c5ab3bc1245cca1f048d26fbec846685ae52
    }
}