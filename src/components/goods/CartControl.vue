<template>
  <div class="cart-control">
    <transition name="move">
      <div v-show="food.count > 0" class="cart-decrease icon-remove_circle_outline" 
        @click.stop="decreaseCart"></div>
    </transition>
    <div v-show="food.count > 0" class="cart-count">{{ food.count }}</div>
    <div class="cart-increase icon-add_circle" @click.stop="increaseCart"></div>
  </div>
</template>

<script>
export default {
  props: {
    food: {
      type: Object
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
      this.$emit('add', event.target)
    },
    decreaseCart() {
      this.food.count--
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-control {
  .cart-decrease, .cart-increase {
    display: inline-block;
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
}
</style>
