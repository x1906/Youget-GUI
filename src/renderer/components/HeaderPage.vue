<template>
  <div class="app-header ">
    <ul class="f-left">
      <li class="active">
        <i class="iconfont icon-jia" @click="dialogVisible = true"></i>
      </li>
      <li>
        <i class="iconfont icon-kaishi"></i>
      </li>
      <li>
        <i class="iconfont icon-zanting"></i>
      </li>
      <li>
        <i class="iconfont icon-shanchu"></i>
      </li>
      <li>
        <i class="iconfont icon-yidong"></i>
      </li>
    </ul>
    <ul class="f-right">
      <li>
        <i class="iconfont icon-menu"></i>
      </li>
      <li>
        <i class="iconfont icon-sousuo"></i>
      </li>
    </ul>

    <el-dialog title="新建下载" :visible.sync="dialogVisible" width="65%">
      <el-form>
        <el-form-item>
          <el-input v-model="form.url" placeholder="请输入下载视频网址">
            <template slot="append">
              <el-button :loading="infoLoading" title="显示详情" @click="showInfo">
                <i v-if="!infoLoading" class="iconfont icon-xiangqing"></i>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  mounted() {
    console.log('挂载');
  },
  data() {
    return {
      form: {
        url: '',
        info: {},
      },
      infoLoading: false,
      dialogVisible: false,
    };
  },
  method: {
    showInfo() {

    },
  },
};
</script>

<style scoped>
.app-header {
  background-color: #545c64;
  width: 100%;
  height: 100%;
}
.app-header ul {
  list-style: none;
  margin: 0;
  padding-left: 0;
}
.f-left li {
  float: left;
}
.f-right li {
  float: right;
}
.app-header ul li {
  color: #878d99;
  width: 56px;
  height: 60px;
  line-height: 60px;
  margin: 0;
  cursor: pointer;
  box-sizing: border-box;
  display: list-item;
  vertical-align: middle;
  text-align: center;
  border-bottom: 2px solid transparent;
}

.app-header ul li.active {
  color: rgb(255, 208, 75);
  border-bottom-color: rgb(255, 208, 75);
}
.app-header ul li:hover {
  background-color: rgb(67, 74, 80);
}
</style>
