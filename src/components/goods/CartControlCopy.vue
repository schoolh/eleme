<template>
<!-- 这是我尝试在CartControl组件里实现小球下落的动作，这样也实现了，但如果点击几次加号，小球开始下落，
然后快速上滑列表，就会出现小球最终下落位置不在左下角购物车，而是上移了。所以还是用源码的方法好一些 -->
  <div class="cart-control">
    <transition name="move">
      <div v-show="food.count > 0" class="cart-decrease icon-remove_circle_outline" 
        @click.stop="decreaseCart"></div>
    </transition>
    <div v-show="food.count > 0" class="cart-count">{{ food.count }}</div>
    <div class="cart-increase icon-add_circle" @click="increaseCart"></div>
    <div class="ball-container">
      <!-- 不能用transition-group，因为用了之后，元素设置了transition: all .4s linear;
      或者transition: transform .4s linear;的话，当元素从v-show=false变为true时，
      元素显示时也会有过渡动效，即看到小球从左上角出现，慢慢移动到原本位置。 -->
      <transition v-for="(ball, index) in balls" v-show="ball.show" :key="index" name="drop"
        @enter="dropping">
        <div v-show="ball.show" :data-index="index" class="ball">
          <div class="inner"></div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
      balls: [
        // 以下设置五个就差不多够用了，如果只设置一个，如果点击+键很快的话，
        // 在.ball的css中的transition中设置的时间内连续点击的话，会只有一个小球的效果。
        // 另外，就算设置五个，如果transition中的过渡时间设置比较长，如10s，
        // 那么在10s内如果点击+键超过五次，也不会再有小球出现。
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
    }
  },
  methods: {
    increaseCart(event) {
      // 下面这个是判断是原生的点击事件还是better scroll的点击事件，
      // 原生的不带有_constructed，BScroll有, 有时候BScroll阻止原生事件失败，
      // 所以点击一次可能会产生两次点击事件.
      if (!event._constructed) {
        return
      }
      if (!this.food.count) {
        this.$set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      // this.$emit('add', event.target)
      this.drop()
    },
    decreaseCart() {
      this.food.count--
    },
    drop() {
      for (let i = 0; i < this.balls.length;i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          return
        }
      }
    },
    dropping(el, done) {
      /* eslint-disable no-unused-vars */
      // let refresh = el.offsetHeight; // 这是一个手动触发浏览器重绘的方法
      // this.$nextTick(() => {})
      // 这里不需要触发重绘并在nextTick再改变元素的位置
      let rect = el.getBoundingClientRect()
      let x = -(rect.left - 30)
      let y = window.innerHeight - rect.top - 38
      el.style.transform = `translate(0, ${y}px)`
      let inner = el.getElementsByClassName('inner')[0]
      inner.style.transform = `translate(${x}px)`
      let ballsArray = this.balls
      el.addEventListener('transitionend', function() {
        let index = el.dataset.index
        ballsArray[index].show = false
        el.style.transform = `translate(0, 0)`
        inner.style.transform = `translate(0, 0)`
        el.style.display = 'none'
        done()
      })
      // transitionend是是一个原生DOM事件，vue过渡的enter、leave钩子函数都需要回调函数done()
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-control {
  .cart-decrease, .cart-increase {
    display: inline-block;
    position: relative;
    z-index: 61;
    padding: 6px;
    font-size: 24px;
    line-height: 24px;
    color: rgb(0, 160, 220);
    &.move-enter-active, &.move-leave-active {
      transition: all .4s linear;
    }
    &.move-enter, &.move-leave-to {
      opacity: 0;
      transform: translate(24px) rotate(180deg);
    }
  }
  .cart-count {
    display: inline-block;
    width: 12px;
    padding: 6px 0;
    font-size: 10px;
    line-height: 24px;
    color: rgb(147, 153, 159);
    text-align: center;
    vertical-align: top;
  }
  .ball-container {
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 60;
    width: 36px;
    height: 36px;
    .ball {
      position: absolute;
      top: 8px;
      right: 8px;
      transition: all .4s cubic-bezier(0.49, -0.29, 0.75, 0.41); 
      .inner {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgb(0, 160, 220);
        transition: all .4s linear;
      }
    }
  }
}
</style>
