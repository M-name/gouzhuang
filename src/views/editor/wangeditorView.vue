<template>
  <div>
    <div ref="editor" style="text-align:left"></div>
    <!-- <button v-on:click="getContent">确定</button> -->
    <!-- <el-button type="primary" @click="getContent">确 定</el-button> -->
  </div>
</template>


<script>
import E from "wangeditor"
export default {
  name: "wangeditor",
  data(){
    return {
      editorContent:'',
      
    }
  },
   props: {
    content: {
      type: String
    },
    disabled:{
      default:false
    }
  }, 
  // 用来回显内容（监控父组件中content变化）
  watch:{
    content:function (newVal,oldVal) {
         this.wEditor.txt.html(newVal)
    }
  },
  methods: {
    //获取编辑器中内容
    getContent() {
      return this.wEditor.txt.html()
    },
    setContent() {
      this.wEditor.txt.html(this.content)
    },
    clearContent() {
      this.wEditor.txt.clear()
    },
  },
  mounted () {
    let that = this;
    this.wEditor= new E(this.$refs.editor)
    var editor = this.wEditor;
    editor.config.customUploadImg = function (resultFiles, insertImgFn) {
       var form = new FormData();
         // 文件对象
         form.append("file", resultFiles[0]);
         that.$request.upload(form).then(res =>{
          insertImgFn(res.data.data.split(",")[1])
         })
    // resultFiles 是 input 中选中的文件列表
    // insertImgFn 是获取图片 url 后，插入到编辑器的方法

    // 上传图片，返回结果，将图片插入到编辑器中
    
}
    editor.config.uploadImgServer = 'http://47.118.43.170:8080/api/cos/upload'
    // editor.config.uploadVideoServer = 'http://47.118.43.170:8080/api/cos/upload'
    editor.config.onchange = (html) => {
      this.editorContent = html
    }
    
    editor.create()
     editor.txt.html(this.content)
     if(this.disabled) {
       editor.$textElem.attr('contenteditable', false)
     }else{
       editor.$textElem.attr('contenteditable', true)
     }
  }
  
}
</script>

<style scoped>

</style>
