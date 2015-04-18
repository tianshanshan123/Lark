//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

module lark.player {

    var TempBounds = new Rectangle();
    /**
     * @excluded
     * 渲染节点基类
     */
    export class RenderNode extends HashObject implements IRenderable{

        public constructor(target:DisplayObject) {
            super();
            this.root = target;
        }

        /**
         * 目标显示对象
         */
        public root:DisplayObject;
        /**
         * 目标显示对象以及它所有父级对象的连接矩阵。
         */
        public matrix:Matrix = null;
        /**
         * 目标显示对象的测量边界
         */
        public bounds:Rectangle = null;
        /**
         * 在屏幕上的矩形区域是否发现改变。
         */
        $moved:boolean = false;
        /**
         * 要绘制到屏幕的整体透明度。
         */
        $alpha:number = 1;
        /**
         * 是否需要重绘
         */
        $isDirty:boolean = false;

        $stageRegion:Region = new Region();

        /**
         * 更新节点属性
         */
        $update():void {
            this.root.$updateRenderNode();
            this.updateBounds();
        }

        protected updateBounds():void{
            var stage = this.root.$stage;
            if (!stage) {
                this.$finish();
                return;
            }
            if (!this.$moved) {
                return;
            }
            var bounds = TempBounds.copyFrom(this.bounds);
            var matrix = this.matrix;
            var m = matrix.$data;
            //优化，通常情况下不缩放旋转的对象占多数，直接加上偏移量即可。
            if(m[0]===1.0&&m[1]===0.0&&m[2]===0.0&&m[3]===1.0){
                bounds.x += m[4];
                bounds.y += m[5];
            }
            else{
                matrix.$transformBounds(bounds);
            }
            this.$stageRegion.setTo(bounds.x|0,bounds.y|0,Math.ceil(bounds.x + bounds.width),Math.ceil(bounds.y + bounds.height));
        }

        /**
         * 执行渲染,绘制自身到屏幕
         */
        $render(context:IRenderer):void {

        }

        /**
         * 渲染结束，已经绘制到屏幕
         */
        $finish():void {
            this.$isDirty = false;
            this.$moved = false;
        }
    }
}