// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract QuantumCrowd {
    struct Startup {
        address owner;
        string title;
        string sector;
        uint256 goal;
        uint256 raised;
        string metadataHash; // IPFS hash for additional data
        bool active;
    }

    struct Prediction {
        bytes32 hash;
        uint256 score;
        uint256 confidence;
        string version;
        uint256 time;
    }

    mapping(uint256 => Startup) public startups;
    mapping(uint256 => Prediction) public predictions;
    mapping(uint256 => mapping(address => uint256)) public investments;
    
    uint256 public numberOfStartups = 0;
    
    // Oracle address that can submit predictions
    address public oracleAddress;
    
    // Events
    event StartupCreated(uint256 indexed id, address owner, string title, uint256 goal);
    event PredictionSubmitted(uint256 indexed id, bytes32 hash, uint256 score, uint256 confidence, string version);
    event InvestmentMade(uint256 indexed id, address investor, uint256 amount, uint256 shares);
    
    // Constructor to set the oracle address
    constructor(address _oracleAddress) {
        oracleAddress = _oracleAddress;
    }
    
    // Modifier to restrict certain functions to the oracle
    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Only oracle can call this function");
        _;
    }
    
    // Create a new startup
    function createStartup(
        string memory _title,
        string memory _sector,
        uint256 _goal,
        string memory _metadataHash
    ) public returns (uint256) {
        Startup storage startup = startups[numberOfStartups];
        
        startup.owner = msg.sender;
        startup.title = _title;
        startup.sector = _sector;
        startup.goal = _goal;
        startup.raised = 0;
        startup.metadataHash = _metadataHash;
        startup.active = true;
        
        numberOfStartups++;
        
        emit StartupCreated(numberOfStartups - 1, msg.sender, _title, _goal);
        
        return numberOfStartups - 1;
    }
    
    // Submit prediction (only callable by oracle)
    function submitPrediction(
        uint256 id,
        bytes32 hash,
        uint256 score,
        uint256 confidence,
        string calldata version,
        bytes calldata sig
    ) external onlyOracle {
        require(id < numberOfStartups, "Startup does not exist");
        
        // Verify signature (simplified - in production would verify ECDSA signature)
        // require(verifySignature(hash, score, confidence, version, sig), "Invalid signature");
        
        Prediction storage prediction = predictions[id];
        prediction.hash = hash;
        prediction.score = score;
        prediction.confidence = confidence;
        prediction.version = version;
        prediction.time = block.timestamp;
        
        emit PredictionSubmitted(id, hash, score, confidence, version);
    }
    
    // Invest in a startup
    function invest(uint256 id) external payable {
        require(id < numberOfStartups, "Startup does not exist");
        require(startups[id].active, "Startup is not active");
        require(msg.value > 0, "Investment amount must be greater than 0");
        
        Startup storage startup = startups[id];
        
        // Calculate shares (simplified - in production would use more complex formula)
        uint256 shares = msg.value;
        
        // Update investment records
        investments[id][msg.sender] += msg.value;
        startup.raised += msg.value;
        
        // Transfer funds to startup owner
        (bool sent,) = payable(startup.owner).call{value: msg.value}("");
        require(sent, "Failed to send investment");
        
        emit InvestmentMade(id, msg.sender, msg.value, shares);
    }
    
    // Get all startups
    function getStartups() public view returns (Startup[] memory) {
        Startup[] memory allStartups = new Startup[](numberOfStartups);
        
        for(uint i = 0; i < numberOfStartups; i++) {
            allStartups[i] = startups[i];
        }
        
        return allStartups;
    }
    
    // Get prediction for a startup
    function getPrediction(uint256 id) public view returns (bytes32, uint256, uint256, string memory, uint256) {
        require(id < numberOfStartups, "Startup does not exist");
        Prediction storage prediction = predictions[id];
        return (
            prediction.hash,
            prediction.score,
            prediction.confidence,
            prediction.version,
            prediction.time
        );
    }
    
    // Get investment amount for a specific investor in a startup
    function getInvestment(uint256 id, address investor) public view returns (uint256) {
        return investments[id][investor];
    }
}