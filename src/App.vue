<template>
  <div id="app">
    <VHeader :seller="seller"/>
    <!-- 添加border-1px类，使1px边框样式生效，见mixin.scss中定义的边框和base.scss中将边框根据DPR缩放 -->
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import {urlParse} from './components/common/util'
import VHeader from './components/header/Header.vue'
/* 
icon.scss只能在script标签中引入，文件中包含url，如果在style标签中引入，
会找不到url中的资源，需要将icon.scss中的url修改成
相对于app.vue的路径：./assets/fonts/......才能找到url中的资源
*/
import './assets/scss/index.scss'

const ERR_OK = 0

export default {
  name: 'App',
  components: {
    VHeader
  },
  data() {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse()
          return queryParam.id
        })()
      }
    }
  },
  created() {
    this.$http.get('/seller?id=' + this.seller.id).then((res) => {
      // window.console.log(res)
      res = res.data
      if (res.errno === ERR_OK) {
        this.seller = Object.assign({}, this.seller, res.data)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
// mixin.scss只能在style标签中引入，如果在script标签中import，会报错找不到它。
@import './assets/scss/mixin.scss';

#app {
  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    @include border-1px(rgba(7, 17, 27, 0.1));
    .tab-item {
      flex: 1;
      text-align: center;
      & > a {
        display: block;
        font-size: 14px;
        color: rgb(77, 85, 93);
        &.router-link-active {
          color: rgb(240,20,20);
        }
      }
    }
  }
}
</style>
