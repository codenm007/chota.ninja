(this["webpackJsonpawesome-todo-app"]=this["webpackJsonpawesome-todo-app"]||[]).push([[0],{116:function(e,t,a){},118:function(e,t,a){},177:function(e,t,a){"use strict";a.r(t);var c=a(0),s=a(20),n=a.n(s),d=a(26),r=a(44),i=a.n(r),l=(a(116),a(89)),o=a(10),j=a(2),b=a(23),m=(a(118),a(32)),h={start_date:(new Date).toISOString()},u=Object(m.b)({name:"day",initialState:h,reducers:{update_date:function(e,t){e.start_date=t.payload},prev_week:function(e){var t=new Date(e.start_date);e.start_date=new Date(t.getFullYear(),t.getMonth(),t.getDate()-7).toISOString()},next_week:function(e){var t=new Date(e.start_date);e.start_date=new Date(t.getFullYear(),t.getMonth(),t.getDate()+7).toISOString()}}}),O=u.reducer,x=u.actions,p=JSON.parse(localStorage.getItem("todos"));console.log(p,"prev_todos");var v=[{id:"asda88dsdsa",created_at:(new Date).toISOString(),description:"Demo_Task 1",is_completed:!1},{id:"asdasssdsdsa",created_at:(new Date).toISOString(),description:"Demo_Task 2",is_completed:!1},{id:"asdasssdsd333sa",created_at:"2021-05-12T14:03:53.495Z",description:"Demo_Task previous scheduled 2",is_completed:!1}],f=[];p&&(f=p),p||(f=v);var y=Object(m.b)({name:"day",initialState:f,reducers:{add_event:function(e,t){var a=t.payload;e.push(a)},mark_as_done:function(e,t){var a=t.payload;e[a].is_completed=!e[a].is_completed},remove_event:function(e,t){var a=t.payload;e.splice(a,1)}}}),g=y.reducer,_=y.actions,w=a(184),N=a(185),D=a(186),k=a(187),S=a(86),T=a.n(S),I=(a(119),a(189)),C=a(39);Date.prototype.getWeek=function(){return[new Date(this.setDate(this.getDate()-this.getDay()))].concat(String(Array(6)).split(",").map((function(){return new Date(this.setDate(this.getDate()+1))}),this))};var A=function(e,t){return e.getFullYear()===t.getFullYear()&&e.getMonth()===t.getMonth()&&e.getDate()===t.getDate()},B=[],F=function(){var e=Object(d.b)(),t=Object(d.c)((function(e){return e.day.start_date})),a=Object(d.c)((function(e){return e.events}));localStorage.setItem("todos",JSON.stringify(a));var s=Object(c.useState)(!1),n=Object(b.a)(s,2),r=n[0],i=n[1],l=Object(c.useState)(new Date),o=Object(b.a)(l,2),m=o[0],h=o[1],u=Object(c.useState)(""),O=Object(b.a)(u,2),p=O[0],v=O[1];Object(c.useEffect)((function(){B=function(e){var t=new Date(new Date(e).toISOString()).getWeek(),a=["SUN","MON","TUE","WED","THU","FRI","SAT"],c=[];return t.map((function(e){var t=a[new Date(e).getDay()],s=new Date(e),n=s.getTime(),d=s.getDate(),r="prev";A(new Date,s)&&(r="today"),(new Date).getTime()<n&&(r="next"),c.push({date_ins:s,day:t,date:d,day_check:r})})),c}(t),i(!0)}),[r]);var f=function(t){var c=a.findIndex((function(e){return e.id==t}));e(_.mark_as_done(c)),C.a.info("Yaah ! Task status change successfully !"),i(!1)};return Object(j.jsxs)("div",{className:"container my-4 ",children:[r&&Object(j.jsx)("div",{className:"row",children:B.map((function(t){var c="day_name ml-2",s="prev_date";"today"===t.day_check&&(c="today_day_name",s="today_date"),"next"===t.day_check&&(s="next_date");return Object(j.jsxs)("div",{className:"col",children:[Object(j.jsx)("table",{children:Object(j.jsx)("tr",{children:Object(j.jsx)("td",{children:Object(j.jsx)("div",{className:"card border border-primary",children:Object(j.jsxs)("div",{className:"card-body",children:[Object(j.jsxs)("div",{className:c,style:{marginLeft:"50px",marginBottom:"1rem"},children:[" ",t.day," "]}),Object(j.jsxs)("span",{className:s,style:{marginLeft:"50px"},children:[" ",t.date]})]})})})})}),a.map((function(c){if(A(new Date(t.date_ins),new Date(c.created_at))){var s=[];return c.is_completed?s.push(Object(j.jsx)("tr",{children:Object(j.jsx)("td",{children:Object(j.jsx)("div",{className:"card",style:{backgroundColor:"green"},id:c.id,onClick:function(){f(c.id)},children:Object(j.jsx)("div",{className:"card-body",children:Object(j.jsx)("p",{style:{overflow:"hidden",textOverflow:"ellipsis",width:"100px",color:"white"},children:c.description})})})})})):s.push(Object(j.jsx)("tr",{children:Object(j.jsx)("td",{children:Object(j.jsx)("div",{className:"row justify-content-center my-2",children:Object(j.jsx)("div",{className:"card",children:Object(j.jsxs)("div",{className:"card-body",children:[Object(j.jsx)("p",{style:{overflow:"hidden",textOverflow:"ellipsis",width:"100px"},children:c.description}),Object(j.jsxs)("div",{className:"d-flex justify-content-center row",children:[Object(j.jsx)("div",{className:"col-12 col-md-6",id:c.id,onClick:function(){f(c.id)},children:Object(j.jsx)(w.a,{color:"green",size:"1.4rem",children:" "})}),Object(j.jsx)("div",{id:c.id,className:"col-12 col-md-6",onClick:function(){!function(t){var c=a.findIndex((function(e){return e.id==t}));e(_.remove_event(c)),C.a.warn(" Task removed successfully !"),i(!1)}(c.id)},children:Object(j.jsx)(N.a,{color:"red",size:"1.4rem",children:" "})})]})]})})})})})),Object(j.jsx)("table",{children:s})}})),Object(j.jsxs)("table",{children:[Object(j.jsx)("tr",{children:function(){if("prev"!==t.day_check)return Object(j.jsxs)("td",{children:[Object(j.jsx)("button",{type:"button",className:"btn btn-warning","data-bs-toggle":"modal",style:{width:"100%"},"data-bs-target":"#staticBackdrop",onClick:function(){return v("")},children:"Add Item"}),Object(j.jsx)("div",{className:"modal fade",id:"staticBackdrop","data-bs-backdrop":"static","data-bs-keyboard":"false",tabIndex:"-1","aria-labelledby":"staticBackdropLabel","aria-hidden":"true",children:Object(j.jsx)("div",{className:"modal-dialog",children:Object(j.jsxs)("div",{className:"modal-content",children:[Object(j.jsxs)("div",{className:"modal-header",children:[Object(j.jsx)("h5",{className:"modal-title",id:"staticBackdropLabel",children:"ADD TASK"}),Object(j.jsx)("button",{type:"button",className:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})]}),Object(j.jsxs)("div",{className:"modal-body",children:[Object(j.jsx)("label",{className:"form-label",children:"Task Description"}),Object(j.jsx)("input",{type:"text",className:"form-control",placeholder:"Work To Do",onChange:function(e){return v(e.target.value)}}),Object(j.jsxs)("div",{className:"my-3",children:[Object(j.jsxs)("label",{className:"mx-3",children:[" ","Please select Todo Date:"," "]}),Object(j.jsx)(T.a,{selected:m,onChange:function(e){return h(e)},minDate:new Date,showDisabledMonthNavigation:!0})]})]}),Object(j.jsxs)("div",{className:"modal-footer",children:[Object(j.jsx)("button",{type:"button",className:"btn btn-secondary","data-bs-dismiss":"modal",children:"Close"}),Object(j.jsx)("button",{type:"button","data-bs-dismiss":"modal",className:"btn btn-primary",onClick:function(){0!==p.length?(e(_.add_event({id:Object(I.a)(),created_at:new Date(m).toISOString(),description:p,is_completed:!1})),C.a.success("Yaah ! Task added successfully !"),i(!1)):C.a.error("No task added due to empty description!")},children:"Add Task"})]})]})})})]})}()}),Object(j.jsx)("tr",{children:Object(j.jsx)("td",{children:" \xa0 \xa0 \xa0 \xa0"})})]})]})}))}),Object(j.jsxs)("div",{className:"row ",children:[Object(j.jsx)("div",{className:"col d-flex justify-content-end",children:Object(j.jsxs)("button",{className:"btn btn-primary",onClick:function(){return e(x.prev_week()),void i(!1)},children:[" ",Object(j.jsx)(D.a,{color:"white",size:"1.4rem"})]})}),Object(j.jsx)("div",{className:"col  d-flex justify-content-start",children:Object(j.jsxs)("button",{className:"btn btn-primary",onClick:function(){return e(x.next_week()),void i(!1)},children:[" ",Object(j.jsx)(k.a,{color:"white",size:"1.4rem"})]})})]})]})},M=a(190),Y=a(191),L=a(192),z=function(){return Object(j.jsxs)(j.Fragment,{children:[Object(j.jsx)("div",{children:Object(j.jsx)("nav",{className:"navbar navbar-dark bg-dark",children:Object(j.jsx)("div",{className:"container-fluid",children:Object(j.jsx)("a",{className:"navbar-brand",href:"#",children:"Awesome Todo App"})})})}),Object(j.jsx)("div",{children:Object(j.jsxs)(M.a,{className:"mb-3",children:[Object(j.jsx)(Y.a,{placeholder:"Recipient's username","aria-label":"Recipient's username","aria-describedby":"basic-addon2"}),Object(j.jsx)(L.a,{variant:"outline-secondary",id:"button-addon2",children:"Button"})]})})]})};a(188),a.p;function E(){return Object(j.jsx)(l.a,{children:Object(j.jsx)("div",{children:Object(j.jsxs)(o.c,{children:[Object(j.jsx)(o.a,{exact:!0,path:"/calendar",children:Object(j.jsx)(F,{})}),Object(j.jsx)(o.a,{exact:!0,path:"/",children:Object(j.jsx)(z,{})})]})})})}var J=Object(m.a)({reducer:{day:O,events:g}});i.a.defaults.baseURL="http://localhost:8081/",n.a.render(Object(j.jsx)(d.a,{store:J,children:Object(j.jsx)(E,{})}),document.getElementById("root"))}},[[177,1,2]]]);
//# sourceMappingURL=main.edf5cc01.chunk.js.map