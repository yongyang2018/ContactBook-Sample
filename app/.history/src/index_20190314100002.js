import "../css/index.css";
import Web3 from "web3";
import metaCoinArtifact from "../../build/contracts/Commodity.json";

const App = {
  web3: null,
  account: null, 
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = metaCoinArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        metaCoinArtifact.abi,
        deployedNetwork.address,
      );
      

      $("#codes").blur(function(){
        var value =document.getElementById('codes').value;
        alert(value);
        if (/^[A-Z]+$/.test(value)){   
            return true;   
        }else{
          alert("请输入大写英文字母");   
          return false; 
        }    
      });

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      this.selectAll();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  selectAll: async function(){
    const { getlength } = this.meta.methods;
    var count = await getlength().call();
    if(count>0){
      const { selectAll } = this.meta.methods;
      var html='';
      for(var x=0;x<count;x++){
        var result = await selectAll(x).call();
        var stats='';
        if(result[3]==1){
          stats='上架';
        }else{
          stats='下架';
        }
        html+=' <tr>'+
          ' <td><input type="checkbox" style="width: 0px;" id="checkbox"  name="checkbox" data-id="'+result[4]+'"></td>'+
          ' <td id="">'+result[1]+'</td>'+
          ' <td>'+result[0]+'</td>'+
          ' <td>'+result[2]+'</td>'+
          ' <td>'+stats+'</td>'+
          '</tr>';
      }
      const tbodyhtml = document.getElementById('tbody')
      tbodyhtml.innerHTML='';
      tbodyhtml.innerHTML=html;
    }
  },

  save: async function(){
    const { web3 } = this;
    //商品代码
    var codes=document.getElementById('codes').value
    //名称
    var name=document.getElementById('name').value
    //数量
    var count=document.getElementById('count').value
    //上下架
    var status=document.getElementById('switch').value
    if(code==''||name==''||count==''){
      alert("Parameter cannot be null!");
      return 
    }
    const { saveinfo } = this.meta.methods;
    await saveinfo(name,codes,count,status).send({ from: this.account ,gas: 3141592});
    this.start();
  },

  selectOne: async function() {
    const { web3 } = this;
    //商品编号
    var code=document.getElementById('code').value
    if(code==''){
      this.start();
    }else{
      const tbodyhtml = document.getElementById('tbody')
      tbodyhtml.innerHTML='';
      const { getlength } = this.meta.methods;
      var count = await getlength().call();
      if(count>0){
        const { selectOne } = this.meta.methods;
        var html='';
        for(var x=0;x<count;x++){
          var bool = await selectOne(x,code).call();
          if(bool==true){
            const { selectAll } = this.meta.methods;
            var result = await selectAll(x).call();
            var stats='';
            if(result[3]==1){
              stats='上架';
            }else{
              stats='下架';
            }
            var html=' <tr>'+
              ' <td><input type="checkbox" style="width: 0px;" id="checkbox"  name="checkbox" data-id="'+result[4]+'"></td>'+
              ' <td>'+result[1]+'</td>'+
              ' <td>'+result[0]+'</td>'+
              ' <td>'+result[2]+'</td>'+
              ' <td>'+stats+'</td>'+
              '</tr>';
            tbodyhtml.innerHTML=html;
            return false;
          }
        }
      }else{
        this.start();
      }
    }
  },

  update: async function() {
    const { web3 } = this;
    var dataid='';
    $('tbody').find('input').each(function(){
      if($(this).prop('checked')==true){
        dataid=$(this).attr("data-id");
        return false;
      }
    })
    if(dataid==''){
      alert("No choice!");
      return false;
    }
    const { update } = this.meta.methods;
    update(dataid).send({ from: this.account});
    this.start();
  },
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
    );
  }

  App.start();
});
