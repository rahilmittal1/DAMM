// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DAMM {
    struct Pool {
        address[] tokens;
        mapping(address => uint256) reserves;
        uint256 fee;
    }

    Pool[] public pools;

    event PoolCreated(uint256 poolId, address[] tokens);
    event Swap(address indexed user, uint256 poolId, address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOut);

    // NEW: View function for frontend/tests to read pool tokens
    function getPoolTokens(uint256 poolId) public view returns (address[] memory) {
        return pools[poolId].tokens;
    }

    // NEW: View function to check token reserves
    function getReserve(uint256 poolId, address token) public view returns (uint256) {
        return pools[poolId].reserves[token];
    }

    function createPool(address[] calldata _tokens, uint256 initialFee) external {
        require(_tokens.length >= 2, "At least 2 tokens required");
        
        Pool storage newPool = pools.push();
        newPool.tokens = _tokens;
        newPool.fee = initialFee;

        emit PoolCreated(pools.length - 1, _tokens);
    }

    function addLiquidity(uint256 poolId, uint256[] calldata amounts) external {
        Pool storage pool = pools[poolId];
        require(amounts.length == pool.tokens.length, "Invalid amounts length");
        
        for (uint256 i = 0; i < pool.tokens.length; i++) {
            pool.reserves[pool.tokens[i]] += amounts[i];
        }
    }

    function swap(uint256 poolId, address tokenIn, address tokenOut, uint256 amountIn) external returns (uint256 amountOut) {
        Pool storage pool = pools[poolId];
        require(pool.reserves[tokenIn] > 0 && pool.reserves[tokenOut] > 0, "Invalid tokens");
        
        uint256 reserveIn = pool.reserves[tokenIn];
        uint256 reserveOut = pool.reserves[tokenOut];
        amountOut = (reserveOut * amountIn) / (reserveIn + amountIn);
        
        // Apply fee
        amountOut = amountOut * (1000 - pool.fee) / 1000;

        pool.reserves[tokenIn] += amountIn;
        pool.reserves[tokenOut] -= amountOut;

        emit Swap(msg.sender, poolId, tokenIn, amountIn, tokenOut, amountOut);
    }

    function setFee(uint256 poolId, uint256 newFee) external {
        pools[poolId].fee = newFee;
    }

    

    function getPoolCount() external view returns (uint256) {
        return pools.length;
    }

    function getPoolById(uint256 poolId) external view returns (address[] memory tokens, uint256 fee) {
        return (pools[poolId].tokens, pools[poolId].fee);
    }
}