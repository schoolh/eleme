<template>
  <div class="goods">
      <div ref="menuWrapper" class="menu-wrapper">
        <ul>
          <li v-for="(item, index) in goods" :key="index" class="menu-item"
          :class="{current: currentIndex === index}" @click="selectMenu(index, $event)">
            <span class="menu-text border-1px">
              <span v-if="item.type >= 0" class="icon" :class="classMap[item.type]"></span>{{ item.name }}
            </span>
          </li>
        </ul>
      </div>
      <div ref="foodsWrapper" class="foods-wrapper">
        <ul>
          <li v-for="(item, index) in goods" :key="index" ref="foodList" class="food-list">
            <h1 class="type">{{ item.name }}</h1>
            <ul>
              <li v-for="(food, index) in item.foods" :key="index" class="food-item border-1px"
                @click="selectFood(food)">
                <img :src="food.icon">
                <div class="content">
                  <h2>{{ food.name }}</h2>
                  <p v-if="food.description" class="desc">{{ food.description }}</p>
                  <p class="extra">
                    <span class="count">月售{{ food.sellCount }}份</span><span>好评率{{ food.rating }}%</span>
                  </p>
                  <div class="price">
                    <span class="now">&yen;{{ food.price }}</span>
                    <span v-if="food.oldPrice" class="old">&yen;{{ food.oldPrice }}</span>
                  </div>
                  <div class="cart-control-wrapper">
                    <CartControl :food="food" @add="addFood"></CartControl>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <Food :food="selectedFood" ref="food" @add="addFood"></Food>
      <ShopCart ref="shopCart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice"
    :minPrice="seller.minPrice"></ShopCart>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import CartControl from './CartControl'
import ShopCart from './ShopCart'
import Food from './Food'

const ERR_OK = 0

export default {
  components: {
    CartControl,
    ShopCart,
    Food
  },
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: [],
      classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
      // 记录依次累加food-list的高度
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  computed: {
    // 计算滑动food-list后scrollY对应listHeight的哪个区间，也就得到对应的menu-item是第几个
    currentIndex() {
      for (let i = 0; i < this.listHeight.length - 1; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (this.scrollY >= height1 && this.scrollY < height2) {
          return i
        }
      }
      return this.listHeight.length - 1
    },
    selectFoods() {
      let foods = []
      this.goods.forEach(good => {
        good.foods.forEach(food => {
          if (food.count > 0) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  created() {
    this.$http.get('/goods').then((res) => {
      // window.console.log(res)
      res = res.data
      if (res.errno === ERR_OK) {
        this.goods = res.data
        // 以下是为了在goods改变后，DOM发生改变后再初始化滚动
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    })
  },
  methods: {
    // 使menu和foods都能滑动，使用了better-scroll
    _initScroll() {
      // better-scroll会将点击事件去掉，如果滚动部分需要有点击事件，需要在参数里加上click：true。
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {click: true})
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        // 这里要设置probeType:3才能派发scroll事件
        probeType: 3
      })
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight() {
      let height = 0
      this.listHeight.push(height)
      let foodList = this.$refs.foodList
      for (let i = 0; i < foodList.length; i++) {
        height += foodList[i].clientHeight
        this.listHeight.push(height)
      }
    },
    selectMenu(index, event) {
      // better-scroll会将点击事件去掉，如果滚动部分需要有点击事件，需要在参数里加上click：true。
      // 同时，在PC上或某些手机端，由于未成功将touchend事件move掉，点击事件会执行两次。
      // better-scroll派发的event事件和原生js的event有属性上的区别，其中有一个属性为event._constructed。better-scroll派发的事件中event._constructed为true，原生点击事件中没有这个属性。
      if (!event._constructed) {
        // 如果不存在这个属性,则为原生点击事件，直接返回，不执行下面的程序
        return
      }
      let foodList = this.$refs.foodList
      let el = foodList[index]
      this.foodsScroll.scrollToElement(el, 300)
    },
    _drop(target) {
      // 体验优化，异步执行下落动画
      this.$nextTick(
        this.$refs.shopCart.drop(target)
      )
    },
    addFood(target) {
      this._drop(target)
    },
    selectFood(food) {
      this.selectedFood = food
      this.$refs.food.show()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/mixin.scss';

.goods {
  display: flex;
  position: absolute;
  top: 176px;
  bottom: 46px;
  width: 100%;
  overflow: hidden;
  .menu-wrapper {
    flex: 0 0 80px;
    background: #f3f5f7;
    .menu-item {
      display: table;
      width: 56px;
      height: 54px;
      padding: 0 12px;
      &.current {
        position: relative;
        z-index: 10;
        margin-top: -1px;
        background: #ffffff;
        font-weight: 900;
        .menu-text {
          @include border-none();
        }
      }
      .menu-text {
        display: table-cell;
        vertical-align: middle;
        font-size: 12px;
        line-height: 14px;
        @include border-1px(rgba(7, 17, 27, 0.1));
        .icon {
          display: inline-block;
          vertical-align: top;
          width: 12px;
          height: 12px;
          margin-right: 2px;
          background-size: 12px 12px;
          background-repeat: no-repeat;
          &.decrease {
            @include bg-image("../../assets/img/decrease_3");
          }
          &.discount {
            @include bg-image("../../assets/img/discount_3");
          }
          &.guarantee {
            @include bg-image("../../assets/img/guarantee_3");
          }
          &.invoice {
            @include bg-image("../../assets/img/invoice_3");
          }
          &.special {
            @include bg-image("../../assets/img/special_3");
          }
        }
      }
    }
  }
  .foods-wrapper {
    flex: 1;
    .type {
      height: 26px;
      padding-left: 14px;
      border-left: 2px solid #d9dde1;
      background: #f3f5f7;
      font-size: 12px;
      line-height: 26px;
      color: rgb(147, 153, 159);
    }
    .food-item {
      display: flex;
      margin: 0 18px;
      padding: 18px 0;
      @include border-1px(rgba(7, 17, 27, 0.1));
      &:last-child {
        @include border-none();
      } 
      img {
        flex: 0 0 57px;
        width: 57px;
        height: 57px;
        margin-right: 10px;
      }
      .content {
        flex: 1;
        h2 {
          margin: 2px 0 8px;
          font-size: 14px;
          line-height: 14px;
          color: rgb(7, 17, 27);
        }
        .desc, .extra {
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
        .desc {
          line-height: 12px;
          margin-bottom: 8px;
        }
        .extra {
          .count {
            margin-right: 12px;
          }
        }
        .cart-control-wrapper {
          position: absolute;
          right: 0;
          bottom: 12px;
        }
      }
      .price {
        font-weight: 700;
        line-height: 24px;
        .now {
          margin-right: 8px;
          font-size: 14px;
          color: rgb(240, 20, 20);
        }
        .old {
          font-size: 10px;
          color: rgb(147, 153, 159);
          text-decoration: line-through;
        }
      }
    }
  }
}
</style>
