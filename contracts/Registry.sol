pragma solidity ^0.5.0; 

import "./Owned.sol";

contract Registry is Mortal{
    event Register(address addr, string name, uint createdAt);

    mapping (string => File[]) private files;

    struct File {
	    address addr;
	    string name;
	    uint createdAt;
	}

    function register(string calldata hash, string calldata name) external payable {
        require(!empty(hash), "Informe uma hash para registro!");
        require(!empty(name), "Informe uma nome para registro!");
        
        emit Register(msg.sender, name, now);

        files[hash].push(File(msg.sender, name, now));	    
    }

    function getRegisterCount(string memory hash) public view returns (uint){
        return files[hash].length;
    }

    function verify(string memory hash, uint index) public view returns (address, string memory, uint){
        require(files[hash].length > 0, "Nenhum documento foi autenticado para essa hash!");

        File storage f = files[hash][index];

        return (f.addr, f.name, f.createdAt);
    }

    function empty(string memory a) private pure returns (bool){
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(""));
    }
}