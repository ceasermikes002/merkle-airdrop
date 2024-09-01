const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const MyTokenModule = buildModule("MyTokenModule", (m: any) => {
  

  const token = m.contract("MyToken"); 

  return { token };
});

module.exports = MyTokenModule;
