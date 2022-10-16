// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
//Contract
contract WhiteList {
    //Variables
    uint8 public upperLimWhiteList;
    uint8 public numAddressesWhitelisted;
    mapping(address => bool) public whiteListMembers;
    //Constructor
    constructor(uint8 _upperLimWhiteList) {
        upperLimWhiteList = _upperLimWhiteList;
    }
    //Modifiers
    modifier notInWhiteList (){
        require(!whiteListMembers[msg.sender],"Already a Member");
    _;}
    modifier limitTracker(){
        require(numAddressesWhitelisted < upperLimWhiteList,"Limit Reached! No more further entries Accepted");
    _;}
    //Function
    function permitting() public notInWhiteList limitTracker{
        whiteListMembers[msg.sender] = true;
        numAddressesWhitelisted += 1;
    }
}
