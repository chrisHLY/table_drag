/**
 * Created by wigo.chen on 2016/12/27.
 */
(function ($) {
    $.fn.extend({
        columnDrag : function (options) {
            var el = this;
            var tr_parent,tr,ths, allThs;
            //表头行的父级
            var thead = $(el).children("thead");
            if(!thead || thead.length <= 0)
                tr_parent = $(el);
            else tr_parent = thead;
            //表头行
            tr = tr_parent.children("tr:eq(0)");
            //所有的表头th
            ths = tr.children("th");
            allThs = $(el).find("tr");
            var goal_th;
            var drag_th;
            //目标的位置 前面：true   后面：false
            var isLeft = true;
            //所有表头th增加拖动事件
            var index = 0 ;
            //region 表头所有th增加拖动事件
            $.each(ths, function () {
                //可以拖动的属性， 没有该属性无法拖动
                $(this).attr("draggable", "true");
                //该属性是列所在的位置， 根据此所以方便交换两列位置
                $(this).attr("drag-index", index);
                index++;
                //region 绑定 鼠标进入事件
                this.ondragenter = function (e) {
                    e.preventDefault();
                };
                //endregion
                //region 绑定 鼠标在元素内移动的事件
                this.ondragover = function (e) {
                    //当前单元格的
                    //如果draggable 不等于true时，表示，该单元格是用于展示移动后样子的单元格，临时的
                    if($(e.target).attr("draggable") == "true" ){
                        var width = $(e.target).width() / 2;
                        var x = e.offsetX || e.layerX;
                        //进入新的单元格内
                        if(!goal_th || goal_th.id != e.target.id){
                            isLeft = width > x;
                            //region 此处 添加临时单元格以便展示，并且隐藏被拖动的单元格
                            //删除临时单元格
                            $(tr).children("td").remove();
                            //目标单元格
                            goal_th = e.target;
                            //目标单元格 和 拖动的单元格不是一个时才继续下面的动作
                            if(drag_th.id != goal_th.id){
                                //隐藏被拖动的单元格
                                $(drag_th).hide();
                                //创建临时单元格
                                var td = document.createElement("td");
                                $(td).addClass("drag_class_lin");
                                td.textContent = drag_th.textContent;
                                //将临时单元格放于目标单元格前方
                                if(isLeft)
                                    $(td).insertBefore(goal_th);
                                else $(td).insertAfter(goal_th);
                            }
                            //endregion
                        }
                        //在同一单元格 鼠标过了中线
                        else if(isLeft != (width > x)){
                            isLeft = width > x;
                            //region 此处 添加临时单元格以便展示，并且隐藏被拖动的单元格
                            //删除临时单元格
                            $(tr).children("td").remove();
                            //目标单元格
                            goal_th = e.target;
                            //目标单元格 和 拖动的单元格不是一个时才继续下面的动作
                            if(drag_th.id != goal_th.id){
                                //隐藏被拖动的单元格
                                $(drag_th).hide();
                                //创建临时单元格
                                var td = document.createElement("td");
                                $(td).addClass("drag_class_lin");
                                td.textContent = drag_th.textContent;
                                //将临时单元格放于目标单元格前方
                                if(isLeft)
                                    $(td).insertBefore(goal_th);
                                else $(td).insertAfter(goal_th);
                            }
                            //endregion
                        }

                    }
                    e.preventDefault();
                };
                //endregion
                //region 绑定 拖动结束事件
                this.ondragend = function (e) {
                    //被拖动的th
                    var th = $(e.target);
                    //显示拖动的单元格
                    $(th).show();
                    //删除临时单元格
                    $(tr).children("td").remove();
                    //被拖动的单元格所在的索引
                    var drag_index = $(th).attr("drag-index");
                    //目标单元格所在的索引
                    var goal_index = $(goal_th).attr("drag-index");
                    if(goal_index && drag_index && drag_index != goal_index){
                        for(var i = 0 ; i < allThs.length; i++){
                            if(isLeft){
                                //表头th交换位置
                                $(allThs[i]).children("th:eq(" + drag_index + ")").insertBefore($(allThs[i]).children("th:eq(" + goal_index + ")"));
                                //其他行的单元格交换位置
                                $(allThs[i]).children("td:eq(" + drag_index + ")").insertBefore($(allThs[i]).children("td:eq(" + goal_index + ")"));
                            }
                            else {
                                //表头th交换位置
                                $(allThs[i]).children("th:eq(" + drag_index + ")").insertAfter($(allThs[i]).children("th:eq(" + goal_index + ")"));
                                //其他行的单元格交换位置
                                $(allThs[i]).children("td:eq(" + drag_index + ")").insertAfter($(allThs[i]).children("td:eq(" + goal_index + ")"));
                            }
                        }
                        //表格变动了，更新表头集合及索引值
                        //所有的表头th
                        ths = tr.children("th");
                        //更新表头索引值
                        index = 0 ;
                        $.each(ths, function () {
                            $(this).attr("drag-index", index);
                            index++;
                        });
                    }
                };
                //endregion
                //region 绑定 拖动时事件
                this.ondrag = function (e) {
                    //记录被拖动的单元格
                    drag_th = this;
                    e.preventDefault();
                };
                //endregion
            });
            //endregion
        }
    });
})(jQuery);