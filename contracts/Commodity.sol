pragma solidity >=0.4.21 <0.6.0;
 
/**
 * owned是合约的管理者
 */
contract owned {
    address public owner;
 
    /**
     * 初台化构造函数
     */
    constructor() public {
        owner = msg.sender;
    }
 
    /**
     * 判断当前合约调用者是否是合约的所有者
     */
    modifier onlyOwner {
        require (msg.sender == owner);
        _;
    }
 
    /**
     * 合约的所有者指派一个新的管理员
     * @param  newOwner address 新的管理员帐户地址
     */
    function transferOwnership(address newOwner) onlyOwner public{
        if (newOwner != address(0)) {
            owner = newOwner;
        }
    }
}

contract Commodity is owned{

    //属性
    struct Comminfo {
        string account_name;//商品名称
        string code;    //商品编号
        string number;  //商品数量
        uint8  status;  //1是上架，2是下架
    }

    //记录所有数据映射
    mapping (uint => Comminfo) commOf;
    
    uint[] lengths;

    constructor() public{}

    //获取长度
    function getlength() public view returns (uint len){
        return lengths.length;
    }

    //保存
    function saveinfo(string memory account_names ,string memory codes,string memory numbers,uint8 statusw) public{
        uint les = lengths.length;

        commOf[les].account_name = account_names;
        commOf[les].code=codes;
        commOf[les].number=numbers;
        commOf[les].status=statusw;
        lengths.push(les);
    }
 
    //查询数据
    function selectAll(uint key) public view returns (string memory account_name,string memory code,string memory number,uint8 status,uint id){
        account_name=commOf[key].account_name;
        code=commOf[key].code;
        number=commOf[key].number;
        status=commOf[key].status;  
        id=key;

        return (account_name,code,number,status,id);
    }

    //两个string比较
    function utilCompareInternal(string memory a, string memory b) internal view returns (bool succ) {
        if (bytes(a).length != bytes(b).length) {
            return false;
        }
        for (uint i = 0; i < bytes(a).length; i ++) {
            if(bytes(a)[i] != bytes(b)[i]) {
                return false;
            }
        }
        return true;
    }

    //根据商品代获取数据
    function selectOne(uint key,string memory code) public view returns(bool result){
        return utilCompareInternal(commOf[key].code,code);
    }

    //上架/下架
    function update(uint key) public{
        if(commOf[key].status==1){
            commOf[key].status=2;
        }else{
            commOf[key].status=1;
        }
    }

}

