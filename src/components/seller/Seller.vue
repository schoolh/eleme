<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <div class="header">
          <div class="title">{{ seller.name }}</div>
          <div class="desc">
            <star :size="36" :score="seller.score">></star>
            <span class="text">({{ seller.ratingCount }})</span>
            <span class="text">月售{{ seller.sellCount }}单</span>
          </div>
          <div class="favorite"  @click="toggleFavorite">
            <i class="icon-favorite" :class="{'active': favorite}"></i>
            <span class="text">{{ favoriteText }}</span>
          </div>
        </div>
        <ul class="remark">
          <li class="block">
            <div class="info">起送价</div>
            <div class="content"><span class="stress">{{ seller.minPrice }}</span>元</div>
          </li>
          <li class="block">
            <div class="info">商家配送</div>
            <div class="content"><span class="stress">{{ seller.deliveryPrice }}</span>元</div>
          </li>
          <li class="block">
            <div class="info">平均配送时间</div>
            <div class="content"><span class="stress">{{ seller.deliveryTime }}</span>分钟</div>
          </li>
        </ul>
      </div>
      <div class="bulletin-wrapper">
        <div class="bulletin">
          <h1 class="title">公告与活动</h1>
          <p class="content border-1px">
            {{ seller.bulletin }}
          </p>
          <ul class="supports">
            <li v-for="(item, index) in seller.supports" :key="index" class="support-item">
              <i class="icon" :class="classMap[item.type]"></i>
              <span class="text">{{ item.description }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="pics-wrapper">
        <div class="pics">
          <h1 class="title">商家实景</h1>
          <div class="pic-list-wrapper" ref="picListWrapper">
            <ul class="pic-list" ref="picList">
              <li v-for="(pic, index) in seller.pics" :key="index" class="pic-item">
                <img :src="pic">
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="infos-wrapper">
        <div class="infos">
          <h1 class="title">商家信息</h1>
          <ul>
            <li v-for="(info, index) in seller.infos" :key="index" class="info-item">
              {{info}}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import Star from '../star/Star'
import {saveToLocal, loadFromLocal} from '../common/store'

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
      favorite: (() => {
        return loadFromLocal(this.seller.id, 'favorite', false)
      })(),
      classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    }
  },
  computed: {
    favoriteText() {
      return this.favorite ? '已收藏' : '收藏'
    }
  },
  // 之所以需要在mounted以及seller变化时初始化BScroll,是因为当seller是异步获取的,
  // 当组件挂载时并不一定获取到了seller的数据,此时seller为空，相关dom就无法被渲染,并且bscroll是基于dom执行的,
  // 所以需要监听seller的变化然后来重新执行相关的初始化函数
  // 在mounted中也需要初始化BScroll,是因为如果一开始是路由是到goods组件，此时已经获取了seller数据了,
  // 当切换到seller组件时，不会有seller数据的变化，所以不能触发初始化BScroll
  watch: {
    seller: function() {
      this.$nextTick(() => {
        this._initScroll()
        this._initPics()
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._initScroll()
      this._initPics()
    })
  },
  methods: {
    toggleFavorite() {
      this.favorite = !this.favorite
      saveToLocal(this.seller.id, 'favorite', this.favorite)
    },
    _initScroll() {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.seller, {click: true})
      } else {
        this.scroll.refresh()
      }
    },
    _initPics() {
      if (this.seller.pics) {
        let picWidth = 120
        let margin = 6
        let width = (picWidth + margin) * this.seller.pics.length - margin
        // picList的宽度应该由js来控制，让它横向滚动一定要让picList超出picListWrapper的宽度，
        // 所以要用js来设定picList的宽度
        this.$refs.picList.style.width = width + 'px'
        this.$nextTick(() => {
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picListWrapper, {
              // 横向滚动 scrollX 为 true 即可,
              // eventPassthrough 是为了忽略某一方向的滚动处理
              scrollX: true,
              eventPassthrough: 'vertical'
            })
          } else {
            this.picScroll.refresh()
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/mixin';

.seller {
  position: absolute;
  left: 0;
  top: 174px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  .overview {
    padding: 18px;
    .header {
      position: relative; //其实border-1px的mixin中已经将这个设置了position: relative;
      @include border-1px(rgba(7, 17, 27, 0.1));
      .title {
        margin-bottom: 8px;
        font-size: 14px;
        line-height: 14px;
        color: rgb(7, 17, 27);
      }
      .desc {
        padding-bottom: 18px;
        font-size: 0;
        .star {
          display: inline-block;
          margin-right: 8px;
          vertical-align: top;
        }
        .text {
          margin-right: 12px;
          font-size: 10px;
          line-height: 18px;
          color: rgb(77, 85, 93);
        }
      }
      .favorite {
        position: absolute;
        right: -7px;
        top: 0;
        width: 50px;
        text-align: center;
        .icon-favorite {
          display: block;
          margin-bottom: 4px;
          line-height: 24px;
          font-size: 24px;
          color: #d4d6d9;
          &.active {
            color: rgb(240, 20, 20);
          }
        }
        .text {
          // line-height: 10px;
          font-size: 10px;
          color: rgb(77, 85, 93);
        }
      }
    }
    .remark {
      display: flex;
      padding-top: 18px;
      .block {
        flex: 1;
        border-right: 1px solid rgba(7, 17, 27, 0.1);
        text-align: center;
        &:last-child {
          border-right: none;
        }
        .info {
          margin-bottom: 4px;
          font-size: 10px;
          line-height: 10px;
          color: rgb(147, 153, 159);
        }
        .content {
          font-size: 10px;
          line-height: 24px;
          color: rgb(7, 17, 27);
          .stress {
            font-size: 24px;
          }
        }
      }
    }
  }
  .bulletin-wrapper {
    border-top: 1px solid (rgba(7, 17, 27, 0.1));
    padding-top: 16px;
    background: #f3f5f7;
    .bulletin {
      border-top: 1px solid (rgba(7, 17, 27, 0.1));
      padding: 0 18px;
      background: #fff;
      .title {
        margin: 18px 0 8px;
        font-size: 14px;
        line-height: 14px;
        color: rgb(7, 17, 27);
      }
      .content {
        padding: 0 12px 16px;
        font-size: 12px;
        line-height: 24px;
        color: rgb(240, 20, 20);
        @include border-1px(rgba(7, 17, 27, 0.1));
      }
      .supports {
        .support-item {
          padding: 16px 12px;
          @include border-1px(rgba(7, 17, 27, 0.1));
          &:last-child {
            @include border-none();
          }
          .icon {
            display: inline-block;
            margin-right: 6px;
            width: 16px;
            height: 16px;
            background-size: 16px 16px;
            background-repeat: no-repeat;
            vertical-align: top;
            &.decrease {
              @include bg-image("../../assets/img/decrease_4");
            }
            &.discount {
              @include bg-image("../../assets/img/discount_4");
            }
            &.guarantee {
              @include bg-image("../../assets/img/guarantee_4");
            }
            &.invoice {
              @include bg-image("../../assets/img/invoice_4");
            }
            &.special {
              @include bg-image("../../assets/img/special_4");
            }
          }
          .text {
            font-size: 12px;
            line-height: 16px;
            color: rgb(7, 17, 27);
          }
        }
      }
    }
  }
  .pics-wrapper {
    padding-top: 16px;
    border-top: 1px solid (rgba(7, 17, 27, 0.1));
    background: #f3f5f7;
    .pics {
      padding: 18px;
      border-top: 1px solid (rgba(7, 17, 27, 0.1));
      background: #fff;
      .title {
        margin-bottom: 12px;
        font-size: 14px;
        line-height: 14px;
        color: rgb(7, 17, 27);
      }
      .pic-list-wrapper {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        .pic-list {
          .pic-item {
            display: inline-block;
            margin-right: 6px;
            width: 120px;
            height: 90px;
            &:last-child {
              margin-right: 0;
            }
            img {
              width: 120px;
              height: 90px;
            }
          }
        }
      }
    }
  }
  .infos-wrapper {
    padding-top: 16px;
    border-top: 1px solid (rgba(7, 17, 27, 0.1));
    background: #f3f5f7;
    .infos {
      padding: 18px 18px 0;
      border-top: 1px solid (rgba(7, 17, 27, 0.1));
      background: #fff;
      .title {
        padding-bottom: 12px;
        font-size: 14px;
        line-height: 14px;
        @include border-1px(rgba(7, 17, 27, 0.1));
      }
      .info-item {
        padding: 16px 12px;
        font-size: 12px;
        line-height: 16px;
        @include border-1px(rgba(7, 17, 27, 0.1));
        &:last-child {
          @include border-none();
        }
      }
    }
  }
}
</style>