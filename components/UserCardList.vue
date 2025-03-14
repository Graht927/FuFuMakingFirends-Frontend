<template>
  <div>
    <van-empty
      v-if="!userList || userList.length < 1"
      image="search"
      description="数据为空"
    />
    <div
      style="margin-top: 20px; margin-bottom: 1rem"
      :style="{ color: configStyle === 'dark' ? 'white' : 'black' }"
    >
      <van-list
        v-model:loading="onloading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoadDate"
      >
        <van-card
          class="teamCard"
          v-for="item in userList"
          style="margin-top: 1rem; flex-direction: column"
          :desc="item.profile"
          :title="item.username"
          :thumb="
            item.avatarUrl == null || item.avatarUrl.length == 0
              ? 'http://121.40.231.89:4443/i/static/tx.jpg'
              : item.avatarUrl
          "
        >
          <template #price>
            <van-tag
              v-if="item.tags"
              v-for="tag in JSON.parse(item.tags)"
              color="red"
              plain
              type="primary"
              style="margin: 2px 6px 0"
            >
              {{ tag }}
            </van-tag>
          </template>
          <template #footer>
            <svg
              @click="emailUser"
              t="1723536926336"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4264"
              width="30"
              height="30"
            >
              <path
                d="M512 512m-480.0512 0a480.0512 480.0512 0 1 0 960.1024 0 480.0512 480.0512 0 1 0-960.1024 0Z"
                fill="#F0EEE2"
                p-id="4265"
              ></path>
              <path
                d="M736.0512 480.0512H543.9488V287.9488h-63.8976v192.1024H287.9488v63.8976h192.1024v192.1024h63.8976V543.9488h192.1024z"
                fill="#BBAA9C"
                p-id="4266"
              ></path>
            </svg>
          </template>
        </van-card>
      </van-list>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import UserType from "../models/user";

export default {
  name: "UserCardList",
  props: {
    userList: {
      type: Array,
      default: () => [],
    },
    onloading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      configStyle: localStorage.getItem("configStyle"),
      finished: false,
      beginCount: 0,
    };
  },
  methods: {
    emailUser() {
      console.log("联系我");
    },
    onLoadDate() {
      this.onloading = true;
      this.$emit("loadDate", this.beginCount);
      this.beginCount = this.userList[this.userList.length - 1]?.id;
    },
  },
};
</script>

<style scoped>
:deep(.van-card) {
  position: relative;
}

:deep(.van-card__footer) {
  position: absolute;
  top: 36%;
  right: 2%;
  display: inline-block;
}

:deep(.van-card__footer) {
  position: absolute;
  top: 36%;
  right: 4%;
  display: inline-block;
}

.teamCard {
  box-shadow: rgba(6, 24, 44, 0.07) 0px 0px 0px 2px,
    rgba(6, 24, 44, 0.45) 0px 4px 6px -1px,
    rgba(255, 255, 255, 0.06) 0px 1px 0px inset;
  border-radius: 10px;
  width: 90%;
  margin: auto;
}
</style>
