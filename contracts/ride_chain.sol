// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract rideChain{
    
    string private rootRiderRequestHash;
    string private rootDriverOfferHash;
    string private rootUserHash;

    function setRootRiderRequestHash(string memory _rootRiderRequestHash) public{
        rootRiderRequestHash = _rootRiderRequestHash;
    }

    function setRootDriverOfferHash(string memory _rootDriverOfferHash) public {
        rootDriverOfferHash = _rootDriverOfferHash;
    }

    function setRootUserHash(string memory _rootUserHash) public {
        rootUserHash = _rootUserHash;
    }

    function getRootRiderRequestHash() public view returns(string memory){
        return rootRiderRequestHash;
    }

    function getRootDriverOfferHash() public view returns(string memory){
        return rootDriverOfferHash;
    }

    function getRootUserHash() public view returns(string memory){
        return rootUserHash;
    }
    
}