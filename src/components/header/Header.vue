<template>
  <div class="header">
      <div class="content-wrapper">
        <div class="avatar">
          <img :src="seller.avatar">
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
            <span class="text">{{ seller.supports[0].description}}</span>
          </div>
        </div>
        <div v-if="seller.supports" class="support-count" @click="showDetail">
          <span class="count">{{ seller.supports.length }}个</span>
          <i class="icon-keyboard_arrow_right"></i>
        </div>
      </div>
      <div class="bulletin-wrapper" @click="showDetail">
        <span class="bulletin-title"></span>
        <span class="bulletin-text">{{ seller.bulletin }}</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
      <div class="background">
        <img :src="seller.avatar"  width="100%" height="100%">
      </div>
      <transition name="fade">
        <div v-show="detailShow" class="detail">
          <div class="detail-wrapper">
            <h1 class="name">{{ seller.name }}</h1>
            <div class="star-wrapper">
              <Star :size="48" :score="seller.score"/>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="support">
              <li v-for="(item, index) in seller.supports" :key="index" class="support-item">
                <span class="icon" :class="classMap[item.type]"></span>
                <span class="text">{{ item.description }}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">{{ seller.bulletin }}</p>
            </div>
          </div>
          <div class="detail-close">
            <i class="icon-close" @click="hideDetail"></i>
          </div>
        </div>
      </transition>
      
  </div>
</template>

<script>
import Star from '../star/Star'

export default {
  components: {
    Star
  },
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
      detailShow: false
    }
  },
  methods: {
    showDetail() {
      this.detailShow = true
    },
    hideDetail() {
      this.detailShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/mixin';

.header {
  position: relative;
  overflow: hidden;
  background: rgba(7, 17, 27, 0.5);
  color: #ffffff;
  .content-wrapper {
    position: relative;
    padding: 24px 12px 18px 24px;
    .avatar {
      display: inline-block;
      vertical-align: top;
      img {
        width: 64px;
        height: 64px;
        border-radius: 2px;
      }
    }
    .content {
      display: inline-block;
      margin-left: 16px;
      .title {
        margin: 2px 0 8px 0;
        .brand {
          display: inline-block;
          vertical-align: top;
          width: 30px;
          height: 18px;
          @include bg-image("../../assets/img/brand");
          background-size: 30px 18px;
          background-repeat: no-repeat;
        }
        .name {
          margin-left: 6px;
          font-size: 16px;
          line-height: 18px;
          font-weight: bold;
        }
      }
      .description {
        margin-bottom: 10px;
        line-height: 12px;
        font-size: 12px;
      }
      .support {
        .icon {
          display: inline-block;
          vertical-align: top;
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
        .text {
          vertical-align: top;
          line-height: 12px;
          font-size: 10px;
        }
      }
    }
    .support-count {
      position: absolute;
      right: 12px;
      bottom: 14px;
      padding: 0 8px;
      height: 24px;
      line-height: 24px;
      border-radius: 14px;
      background: rgba(0, 0, 0, 0.2);
      font-size: 10px;
      text-align: center;
      .count {
        vertical-align: top;
      }
      .icon-keyboard_arrow_right {
        margin-left: 2px;
        line-height: 24px;
      }
    }
  }
  .bulletin-wrapper {
    position: relative;
    height: 28px;
    padding: 0 22px 0 12px;
    background: rgba(7, 17, 27, 0.2);
    font-size: 10px;
    line-height: 28px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    .bulletin-title {
      display: inline-block;
      margin-top: 8px; 
      width: 22px;
      height: 12px;
      @include bg-image("../../assets/img/bulletin");
      background-size: 22px 12px;
      background-repeat: no-repeat;
      vertical-align: top;
    }
    .bulletin-text {
      margin-left: 4px;
    }
    .icon-keyboard_arrow_right {
      position: absolute;
      top: 8px;
      right: 12px;
    }
  }
  .background {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    filter: blur(10px);
  }
  .detail {
    // 用到了sticky footer，这里用的flex方法实现，源码使用设置负margin的方法实现。
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    overflow: auto;
    width: 100vw; //vw是css3新增的，视窗宽度；
    height: 100vh; //vh是css3新增的，视窗高度；
    background: rgba(7, 17, 27, 0.8);
    &.fade-enter-active, &.fade-leave-active {
      transition: all 1s;
    }
    &.fade-enter, &.fade-leave-to {
      background: rgba(7, 17, 27, 0);
      opacity: 0;
    }
    .detail-wrapper {
      flex: 1;
      padding-bottom: 32px;
      .name {
        margin-top: 64px;
        font-size: 16px;
        font-weight: 700;
        line-height: 16px;
        text-align: center;
      }
      .star-wrapper {
        margin-top: 16px;
        text-align: center;
      }
      .title {
        display: flex;
        width: 80%;
        margin: 28px auto 24px;
        .line {
          flex: 1;
          position: relative;
          top: -6px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        .text {
          padding: 0 12px;
          font-size: 14px;
          font-weight: 700;
        }
      }
      .support {
        width: 80%;
        margin: 0 auto;
        .support-item {
          margin-bottom: 12px;
          padding: 0 12px;
          &:last-child {
            margin-bottom: 0;
          }
          .icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 6px;
            background-size: 16px 16px;
            background-repeat: no-repeat;
            vertical-align: top;
            &.decrease {
              @include bg-image("../../assets/img/decrease_2");
            }
            &.discount {
              @include bg-image("../../assets/img/discount_2");
            }
            &.guarantee {
              @include bg-image("../../assets/img/guarantee_2");
            }
            &.invoice {
              @include bg-image("../../assets/img/invoice_2");
            }
            &.special {
              @include bg-image("../../assets/img/special_2");
            }
          }
          .text {
            font-size: 12px;
            line-height: 16px;
            vertical-align: top;
          }
        }
      }
      .bulletin {
        width: 80%;
        margin: 0 auto;
        .content {
          padding: 0 12px;
          font-size: 12px;
          line-height: 24px;
        }
      }
    }
    .detail-close {
      margin-bottom: 32px;
      text-align: center;
      .icon-close {
        font-size: 32px;
        color:rgba(255, 255, 255, 0.5);
      }
    }
  }
}
</style>
