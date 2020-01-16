<template>
  <div class="header">
      <div class="content-wrapper">
        <div class="avatar">
          <img :src="seller.avatar" width="64" height="64">
        </div>
        <div class="content">
          <div class="title">
            <span class="brand"></span>
            <span class="name">{{ seller.name }}</span>
          </div>
          <div class="description">
            {{ seller.description }}/{{ seller.deliveryTime}}分钟送达
          </div>
          <div v-if="seller.supports" class="support">
            <span class="icon" :class="classMap[seller.supports[0].type]"></span>
            <span>{{ seller.supports[0].description}}</span>
          </div>
        </div>
      </div>
      <div class="bulletin-wrapper"></div>
  </div>
</template>

<script>
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      }
    }
  }
</script>

<style lang='scss' scoped>
@import "../../assets/scss/mixin";
  .header {
    .content-wrapper {
      .avatar {
        display: inline-block;
        img {
          border-radius: 2px;
        }
      }
      .content {
        display: inline-block;
        margin-left: 16px;
        .title {
          margin: 
        }
        .support {
          .icon {
            display: inline-block;
            width: 12px;
            height: 12px;
            margin-right: 4px;
            background-size: 12px 12px;
            background-repeat: no-repeat;
            &.decrease {
              @include bg-image("../../assets/img/decrease_1")
            }
            &.discount {
              @include bg-image("../../assets/img/discount_1");
            }
            &.guarantee {
              @include bg-image("../../assets/img/guarantee_1");
            }
            &.invoice {
              @include bg-image("../../assets/img/invoice_1");
            }
            &.special {
              @include bg-image("../../assets/img/special_1");
            }
          }
        }
      }
    }
  }
</style>
