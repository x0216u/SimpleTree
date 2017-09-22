
(function($){
	$.fn.extend({
		selTree:function(options,sender){
			 
			 var tree= SimpleTree(options,sender,$(this).attr("id"));
			
		},
		setData:function(data){
			var arr="["
			for (var i=0;i<data.length;i++) {
				arr+=JSON.stringify(data[i])+",";
			}
			if(arr!="[")
	        arr=arr.substr(0,arr.length-1)
			arr+="]"	
			$(this).attr("data",arr);
		}
	})
	var defaults={
		onlyLeaf:false,
		onlyIcon:false,
		checkBox:false,
		data:[],
		div:null,
		frameDiv:null,
		divID:'',
		inpID:null//input id
	}
	var SimpleTree=function(options,sender,inpID){
		 var opt={};
	
		 opt.data=options;
		 opt.frameDiv=sender;
		 opt.div=sender.body.childNodes[0];
		 opt.divID=$(opt.div).attr("id");
		 opt.onlyLeaf=$(opt.div).attr("onlyLeaf");
		 opt.onlyIcon=$(opt.div).attr("onlyIcon");
		 opt.checkBox=$(opt.div).attr("checkBox");
		 opt.inpID=inpID;
		 defaults=$.extend({},defaults,opt);
		 init(defaults);
		 addListner(defaults);
	}
   var addListner=function(opt){
   	
   	         var divId=opt.divID;
   	         
         	   //i图标标签添加点击事件
			   $(opt.frameDiv.getElementById(divId)).find(".item").click(function(){
               
				show(this,1,opt);
				
		    	})
			   // 节点悬浮事件
			    $(opt.frameDiv.getElementById(divId)).find("a").hover(function(){
			    	this.style.backgroundColor="rgb(179,231,255)"
			    },function(){
			    	this.style.backgroundColor="white"
			    	
			    })
			   
			   //节点点击事件
			    $(opt.frameDiv.getElementById(divId)).find("a").click(function(){
			   	    var a=$(this);
			   	
			   	    var onlyIcon=opt.onlyIcon;
			     	var onlyLeaf=opt.onlyLeaf;
			   	    
			     	//只能点击图标 才展开
			     	if(onlyIcon=="false"){
			     		
			   		  var ibiao=a.find("i");
			   		  show(ibiao,0,opt);
			     	}
				   //只能选取叶子结点
			    	if(onlyLeaf=="true"){	
				      var leaf=a.attr("leaf");
				       if(leaf=="true"){
				          if(typeof(nodeClick)=="function"){
				  	       nodeClick(a,opt);
				          }
			         	
				        }
				    return;
				   } 
				   if(typeof(nodeClick)=="function"){
				  	nodeClick(a,opt);
				   }
				 
			   })
   
                //checkbox点击事件
			    $(opt.frameDiv.getElementById(divId)).find("input[type=checkbox]").click(function(){
			    
			    	//点击父元素 子元素全部选上
			       var inputs=this.parentElement.parentElement.getElementsByTagName("input");
			      for(var i=0;i<inputs.length;i++){
			      	 if($(this).is(":checked"))
			      	  $(inputs[i]).prop("checked",true);//推荐使用prop
			      	 else
			      	  $(inputs[i]).prop("checked",false);
			      }
			    }) 
   }
   var	init=function(opt){
			   var div=opt.div;
		         var dul=document.createElement("ul");
				 dul.marginLeft="0px";
				 div.appendChild(dul);
				for (var i=0;i<opt.data.length;i++) {
					var li=document.createElement("li");
				    var ul=document.createElement("ul");
				    var a=document.createElement("a");
				    
				    var check=false,box=null;
				    
				    $(a).attr("href","javascript:void(0)");
					var that=opt.data[i];
				    $(a).text(that.name);
				    $(a).attr("leaf","true");//默认都是叶子结点
				    //遍历数据 添加属性
				    for(var pro in that){
				    	if(pro!="id")
				    	 $(a).attr(pro,that[pro])
				    }
					$(li).append(a);
					$(li).attr("id",that.id);
					li.style.marginLeft="21px";//默认
					if($(div).attr("checkBox")=="true"){
				    	 check=true;
				    }
				  	if(check){
				         box=document.createElement("input"); 
				    	box.setAttribute("type","checkbox");
				        $(box).attr("name",that.pid);
				        $(a).append(box);
				    }
						
					//添加节点
						var parentId=opt.frameDiv.getElementById(that.pid);
						
						if(parentId){
							var ibiao=parentId.getElementsByTagName("i");	
							
							//添加标签图标
							if(ibiao.length<1){
							 ibiao=document.createElement("i");
							
							//父元素的子元素 :a标签  在开头添加元素
							 $(parentId).find("a").prepend(ibiao);
							 $(ibiao).addClass("item");
							 //非叶子节点
							 $(ibiao).parent().attr("leaf","false"); //含有子元素 修改为不是叶子结点
							 parentId.style.marginLeft="0px";//默认
							 
							
							}
		                   // alert(parentId.parentNode.style.marginLeft);   
							ul.appendChild(li);
							ul.style.marginLeft=14+"px";
							ul.className="fold ul-"+that.pid;
							parentId.appendChild(ul);
							
							
						}else{
							li.style.marginLeft="21px";//默认
							$(div).children(0).append(li);
						}
				    }
					
				}
		
	var show=function(sender,flag,opt){
	        
			   var icon=opt.onlyIcon;
			   	//只能点击图标 才展开
			   	if(icon=="false"){
			   		 if(flag==1)
			   		 	return;
			   	}
				
				var ibiao=$(sender);
			    var par=$(sender).parent().parent();//li标签
				var id=par.attr("id");
				//alert(id)
				par.find(".ul-"+id).slideToggle(300);//ul元素可见
				ibiao.toggleClass("unfold");//切换图标
			}

	var nodeClick= function (a,opt){
				var val=$(a).text();
				var id=$(a).attr("id");
			    var pid=$(a).attr("pid");
				var inpID= opt.inpID;
				var inp=document.getElementById(inpID)
				$(inp).val(val)
			}
	$(".simpleTree").click(function(){
				var mTop=$(this).offset().top;
				var mleft=$(this).offset().left;
				var cHeight=this.clientHeight;
				if(!$(this).attr("id")){
					$(this).attr("id","inp"+createID())
				}
				var id=$(this).attr("id")+"-1";
				var frameDiv=document.getElementById(id);
			
				if(!frameDiv){
					frameDiv=document.createElement("iframe");
					frameDiv.setAttribute("frameborder","0")
				    frameDiv.setAttribute("id",id);
				    frameDiv.setAttribute("name",id);
			
					frameDiv.style.display="none";
					frameDiv.style.border="1px solid #69d1cb";
					frameDiv.style.margin="0px";
					frameDiv.style.padding="0px";
					frameDiv.style.position="absolute";
					
					frameDiv.style.width=this.clientWidth+"px";
				    $(frameDiv).css("left",mleft);
				    $(frameDiv).css("top",cHeight+mTop+5);
				    var isFirefox=navigator.userAgent.toUpperCase().indexOf("FIREFOX");//是否是火狐浏览器
				    var isIE=navigator.userAgent.toUpperCase().indexOf("MSIE");//ie
				    if(isFirefox>=0){
				        $(frameDiv).attr("src","#")//火狐浏览器不加src属性 渲染较慢 无法获得frame的document 导致添加元素失败
				        //chrome浏览器 360急速模式  默认# 为自身页面
					}
				    document.body.appendChild(frameDiv);
				    var Frame=  document.getElementById(id).contentWindow.document;
				    //Frame= document.getElementById(id).contentDocument;//
	               //加载样式表
				    loadCss(Frame,"css/SimpleTree.css")
			        var divf=document.createElement("div")
			        divf.setAttribute("id",id+"div")
			       if($(this).attr("onlyLeaf")=="true")
				    $(divf).attr("onlyLeaf","true");
				    else
				    $(divf).attr("onlyLeaf","false");
				    if($(this).attr("onlyIcon")=="true")
				    $(divf).attr("onlyIcon","true");
				     else
				    $(divf).attr("onlyIcon","false");
				    if($(this).attr("checkBox")=="true")
				    $(divf).attr("checkBox","true");
				     else
				    $(divf).attr("checkBox","false");
				    $(divf).html("");
				    if(Frame.body){
				    	$(Frame.body).append(divf);
				    }
				   var data=$(this).attr("data");
				    data= $.parseJSON(data)
				   $(this).selTree(data,Frame);

				}
				$(frameDiv).slideToggle();		
			})
		
var loadCss	=function (ele, url ){ 
           var link = document.createElement("link"); 
           link.type = "text/css"; 
           link.rel =  "stylesheet"; 
           link.href = url; 
          var heads= ele.getElementsByTagName("head");
          if(heads){
          	  try{
          	  heads[0].appendChild( link ); 
          	   }
          	   catch(e){
          		// heads.appendChild(link)
          	    }
           }
        }
var createID= function (){
		 	var g = "xxxx";
		 	//g里面包含x
		 	while (/x/.test(g)) 
		 	g = g.replace(/x/, "0123456789abcdef".substr(parseInt(Math.random() * 16), 1));
          return g;
		 }
})(jQuery)
