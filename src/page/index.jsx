import React, {Component} from 'react';
import { Button } from 'antd';

class Page extends Component {

    handleClick = () => {
        console.log('48222')
        const canvas = document.getElementById('tutorial');
        if(!canvas.getContext) return;
        //获得 2d 上下文对�
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
    ctx.arc(20,20, 100, 0, Math.PI * 2);
    ctx.clip();
 
    ctx.fillStyle = "pink";
    ctx.fillRect(20, 20, 100,100);
    }
    render() {
        return (
            <>
            <br></br>
            <img src="./image.jpg" alt="" height="300" width="300" /><br></br>
            <canvas id="tutorial" width="500" height="300">warning</canvas>
            <Button onClick={this.handleClick}>canvas</Button>
            <div>page</div>
            </>
        )
    }
}

export default Page;
