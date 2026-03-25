// SPDX-License-Identifier: UNLICENSED
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
    }
}