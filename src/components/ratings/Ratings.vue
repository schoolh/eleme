<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <div class="score">{{ seller.score }}</div>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{ seller.rankRate }}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{ seller.serviceScore }}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{ seller.foodScore }}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{ seller.deliveryTime }}分钟</span>
          </div>
        </div>
      </div>
      <div class="rating-wrapper">
        <RatingSelect :ratings="ratings" :desc="desc" :selectType="selectType" :onlyContent="onlyContent"
            @select="selectRating" @toggle="toggleContent"></RatingSelect>
        <ul class="rating-list">
          <li v-for="(rating, index) in ratingsToShow" :key="index" class="rating-item">
            <div class="avatar">
              <img :src="rating.avatar">
            </div>
            <div class="content">
              <div class="name">{{ rating.username }}</div>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score">></star>
                <span v-if="rating.deliveryTime" class="delivery">{{ rating.deliveryTime }}</span>
              </div>
              <p class="text">{{ rating.text }}</p>
              <div v-if="rating.recommend && rating.recommend.length" class="recommend">
                <i class="icon-thumb_up"></i>
                <span v-for="(item, index) in rating.recommend" :key="index" class="item">{{ item }}</span>
              </div>
              <div class="time">{{ rating.rateTime | formatDate }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import Star from '../star/Star'
import RatingSelect from '../common/RatingSelect'
import {formatDate} from '../common/date'

const ALL = 2
const ERR_OK = 0

export default {
  components: {
    Star,
    RatingSelect
  },
  filters: {
    formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      ratings: [],
      desc: {
        all: '全部',
        positive: '满意',
        negative: '不满意'
      },
      selectType: ALL,
      onlyContent: true
    }
  },
  computed: {
    ratingsToShow() {
      if (this.ratings) {
        return this.ratings.filter((rating) => {
          let needShow = true
          if (this.onlyContent && !rating.text) {
            needShow = false
          } else if (this.selectType !== ALL && rating.rateType !== this.selectType) {
            needShow = false
          }
          return needShow
        })
      } else {
        return []
      }
    }
  },
  created() {
    this.$http.get('/ratings').then(res => {
      res = res.data
      if (res.errno === ERR_OK) {
        this.ratings = res.data
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.ratings, {click: true})
        })
      }
    })
  },
  methods: {
    selectRating(type) {
      this.selectType = type
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    toggleContent() {
      this.onlyContent = !this.onlyContent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/mixin';

.ratings {
  position: absolute;
  left: 0;
  top: 174px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  .overview {
    display: flex;
    padding: 18px 0;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    .overview-left {
      flex: 0 0 137px;
      padding: 6px 0;
      border-right: 1px solid rgba(7, 17, 27, 0.1);
      width: 137px;
      text-align: center;
      @media only screen and (max-width: 320px) {
        flex: 0 0 120px;
        width: 120px;
      }
      .score {
        margin-bottom: 6px;
        font-size: 24px;
        line-height: 28px;
        color: rgb(255, 153, 0);
      }
      .title {
        margin-bottom: 8px;
        font-size: 12px;
        line-height: 12px;
        color: rgb(7, 17, 27);
      }
      .rank {
        font-size: 10px;
        line-height: 10px;
        color: rgb(147, 153, 159);
      }
    }
    .overview-right {
      flex: 1;
      padding: 6px 0 6px 24px;
      @media only screen and (max-width: 320px) {
        padding-left: 6px;
      }
      .score-wrapper {
        margin-bottom: 8px;
        &:last-child {
          margin-bottom: 0;
        }
        .title {
          display: inline-block;
          font-size: 12px;
          line-height: 18px;
          color: rgb(7, 17, 27);
        }
        .star {
          display: inline-block;
          margin: 0 12px;
          vertical-align: top;
        }
        .score {
          font-size: 12px;
          line-height: 18px;
          color: rgb(255, 153, 0);
        }
        .delivery {
          margin-left: 12px;
          font-size: 12px;
          color: rgb(147, 153, 159);
        }
      }
    }
  }
  .rating-wrapper {
    padding-top: 16px;
    background: #f3f5f7;
    .rating-select {
      padding: 0 18px;
      border-top: 1px solid rgba(7, 17, 27, 0.1);
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      background: #fff;
    }
    .rating-list {
      padding: 0 18px;
      background: #fff;
      .rating-item {
        display: flex;
        padding: 18px 0;
        @include border-1px(rgba(7, 17, 27, 0.1));
        .avatar {
          flex: 0 0 28px;
          margin-right: 12px;
          width: 28px;
          img {
            border-radius: 50%;
            width: 28px;
            height: 28px;
          }
        }
        .content {
          flex: 1;
          position: relative;
          .name {
            margin-bottom: 4px;
            font-size: 10px;
            line-height: 12px;
            color: rgb(7, 17, 27);
          }
          .star-wrapper {
            margin-bottom: 6px;
            .star {
              display: inline-block;
              margin-right: 6px;
            }
            .delivery {
              font-size: 10px;
              color: rgb(147, 153, 159);
            }
          }
          .text {
            margin-bottom: 8px;
            font-size: 12px;
            line-height: 18px;
            color: rgb(7, 17, 27);
          }
          .recommend {
            line-height: 16px;
            font-size: 0;
            .icon-thumb_up, .item {
              display: inline-block;
              margin: 0 8px 4px 0;
              font-size: 9px;
            }
            .icon-thumb_up {
              color: rgb(0, 160, 220);
            }
            .item {
              padding: 0 6px;
              border: 1px solid rgba(7, 17, 27, 0.1);
              border-radius: 1px;
              color: rgb(147, 153, 159);
            }
          }
          .time {
            position: absolute;
            top: 0;
            right: 0;
            line-height: 12px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }
      }
    }
  }
}
</style>
