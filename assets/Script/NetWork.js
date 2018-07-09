let WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;
window.NetTarget = null;

let instance = null;

let Network = cc.Class({
    properties: {
        data: 1000,
        isInit: false,
    },

    ctor() {
        NetTarget = new cc.EventTarget();;
    },

    initNetwork() {
        if (this.isInit) {
            console.log('Network is already inited...');
            return;
        }
        console.log('Network initSocket...');
        let host = "ws://localhost:8080";
       // let host = "ws://47.104.15.140:8080"
        this.socket = new WebSocket(host);
        this.socket.onopen = (evt) => {
            console.log('Network onopen...');
            this.isInit = true;
            NetTarget.emit("netstart");
        }

        this.socket.onmessage = (evt) => {
            let msg = evt.data;
            console.log('Network onmessage:' + evt.data);
            let dataObj = JSON.parse(msg);
            this.appandeMsg(dataObj);
        }

        this.socket.onerror = (evt) => {
            console.log('Network onerror...');
        };

        this.socket.onclose = (evt) => {
            console.log('Network onclose...');
            NetTarget.emit("netclose");
            this.isInit = false;
        }
    },

    //发送消息给服务器
    send(data) {
        if (!this.isInit) alert('Network is not inited...');
        else if (this.socket.readyState == WebSocket.OPEN) {
            let tdata = JSON.stringify(data);
            console.log('Network send:' + tdata);
            this.socket.send(tdata);
        } else console.log('Network WebSocket readState:' + this.socket.readyState);
    },

    //断开连接
    close() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    },
    //接受数据
    appandeMsg(data) {
        NetTarget.emit("net", data);
    },
    /**
     * 模拟服务端数据
     */
    testServerData(data) {
        this.appandeMsg(data);
    },

});

window.Network = instance ? instance : new Network();