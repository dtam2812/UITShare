// SPDX-License-Identifier: UNLICENSED
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

    function mint(
        uint256 amount_,
        string memory tokenURI_,
        uint96 royaltyBps_,
        bytes memory data_
    )
        public
        returns (uint256)
    {
        require(royaltyBps_ > 0, "Royalty required");
        return _mintDocument(msg.sender, amount_, tokenURI_, royaltyBps_, data_);
    }

    // Backend mint hộ user - onlyOwner
    function mintTo(
        address to_,
        uint256 amount_,
        string memory tokenURI_,
        uint96 royaltyBps_,
        bytes memory data_
    )
        public
        onlyOwner
        returns (uint256)
    {
        require(royaltyBps_ > 0, "Royalty required");
        return _mintDocument(to_, amount_, tokenURI_, royaltyBps_, data_);
    }

    function _mintDocument(
        address to_,
        uint256 amount_,
        string memory tokenURI_,
        uint96 royaltyBps_,
        bytes memory data_
    ) internal returns (uint256) {
        require(amount_ > 0 && amount_ <= MAX_SUPPLY_LIMIT, "Invalid amount");
        require(bytes(tokenURI_).length > 0, "URI cannot be empty");
        require(royaltyBps_ <= 5000, "Royalty too high"); 

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        creators[tokenId] = to_;
        totalSupply[tokenId] = amount_;
        _tokenURIs[tokenId] = tokenURI_;

        _mint(to_, tokenId, amount_, data_);
        _setTokenRoyalty(tokenId, to_, royaltyBps_); 

        emit DocumentMinted(tokenId, to_, amount_, tokenURI_);
        return tokenId;
    }

    function setRoyalty(uint256 tokenId, address receiver, uint96 royaltyBps) external {
        require(creators[tokenId] != address(0), "Token does not exist");
        require(creators[tokenId] == msg.sender, "Not creator");
        require(royaltyBps <= 5000, "Royalty too high");
        _setTokenRoyalty(tokenId, receiver, royaltyBps);
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
    }
}