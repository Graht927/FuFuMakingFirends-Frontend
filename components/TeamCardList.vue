<template>
  <div>
    <van-empty v-if="teamList.length === 0"
               image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
               image-size="80"
               description="没有找到噢~~~"
    />
    <div style="margin-top: 20px;padding-bottom: 5rem">
      <van-list
          v-model="onloading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoadData"
      >
        <van-card class="teamCard" v-for="item in teamList"
                  :desc="item.description"
                  :title="item.name"
                  :thumb="item.teamAvatarUrl === null ? defaultTeamAvatar : item.teamAvatarUrl"
                  :style="{margin:'5% auto'}"
        >
          <template #bottom>
            <div>
              <van-tag color="#7232dd" plain>{{ item.status == 2 ? '加密' : '公开' }}</van-tag> &nbsp;人数 {{
                item.maxNum
              }}/{{ item.teamUserInfos?.length }}
            </div>
            <div>创建时间: {{ new Date(item.createTime).toLocaleString() }}</div>
            <div>过期时间: {{ new Date(item.expireTime).toLocaleString() }}</div>
          </template>
          <template v-if="!$route.name.includes('用户中心')" #footer>
            <svg @click="joinTeamUser(item)" t="1723536926336" class="icon" viewBox="0 0 1024 1024" version="1.1"
                 xmlns="http://www.w3.org/2000/svg"
                 p-id="4264" width="30" height="30">
              <path d="M512 512m-480.0512 0a480.0512 480.0512 0 1 0 960.1024 0 480.0512 480.0512 0 1 0-960.1024 0Z"
                    fill="#F0EEE2" p-id="4265"></path>
              <path
                  d="M736.0512 480.0512H543.9488V287.9488h-63.8976v192.1024H287.9488v63.8976h192.1024v192.1024h63.8976V543.9488h192.1024z"
                  fill="#BBAA9C" p-id="4266"></path>
            </svg>
          </template>
        </van-card>
      </van-list>
    </div>
    <van-popup v-model="popupActive"
               :style="{width:'60%',height:'22%',padding: '5% 10% 0',borderRadius:'10px',boxShadow: 'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset' }"
               @close="join">
      <div>
        <van-field v-model="joinTeamData.password" type="password"
                   :style="{width: '100%',borderRadius:'20px',boxShadow:'rgba(0, 0, 0, 0.1) 0px 4px 12px'}"
                   :error="passwordCheck"
                   autofocus
                   :error-message="passwordErrMessage"
                   @input="onUpdate"
                   placeholder="请输入密码"/>
        <van-button size="small" @click="joinSub"
                    :style="{width: '40%',
                margin:'5% 30%',
                boxShadow:'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                position: 'absolute',
                bottom:'10%',
                left:'0'

    }">确定
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { delExpireTeam, joinTeam } from "../services/team";
import { showFailToast, showToast } from "vant";
import { getCurrentUser } from "../services/user";

export default {
  name: "TeamCardList",
  props: {
    teamList: {
      type: Array,
      default: () => []
    },
    listProp: {
      type: Number,
      default: 0
    },
    onloading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      popupActive: false,
      defaultTeamAvatar: "https://img.zcool.cn/community/04b4wf2hltswlkpp4qebcs3937.png",
      joinTeamData: {
        password: "",
        teamId: 0,
        userId: 0,
        pageNum: 0
      },
      statusT: '',
      passwordCheck: false,
      passwordErrMessage: "",
      finished: false
    }
  },
  methods: {
    async joinTeamUser(item) {
      this.statusT = item.status
      const getUserReq = await getCurrentUser();
      if (getUserReq.code !== 20000) {
        showFailToast("用户未登录")
        setTimeout(() => {
        }, 500)
        this.$router.push("/user/login")
      } else {
        this.joinTeamData.teamId = item.id
        this.joinTeamData.userId = getUserReq.data.id
        if (item.status == 2) {
          this.popupActive = true
        } else {
          this.popupActive = false
          const res = await joinTeam(this.joinTeamData);
          if (res.code === 20000) {
            showToast("发送成功")
            this.$emit('childEvent', item.status)
          } else {
            showFailToast(res.description)
            if (res.code === 40100) {
              this.$router.replace("/user/login")
            }
          }
        }
      }
    },
    join() {
      this.joinTeamData.password = ""
      this.passwordCheck = false
      this.passwordErrMessage = ""
    },
    onUpdate(e) {
      if (e.length < 4) {
        this.passwordCheck = true
        this.passwordErrMessage = "密码长度不符"
      }
      if (e.length == 4) {
        this.passwordCheck = false
        this.passwordErrMessage = ""
      }
      if (e.length >= 32) {
        this.passwordCheck = true
        this.passwordErrMessage = "密码长度过长"
      }
    },
    async joinSub() {
      if (this.joinTeamData.password.length < 1) {
        this.passwordCheck = true
      } else {
        this.popupActive = false
        const res = await joinTeam(this.joinTeamData);
        if (res.code === 20000) {
          showToast("发送成功")
          this.$emit('childEvent', this.statusT)
        } else {
          showFailToast("发送失败" + res.description)
          if (res.code === 40100) {
            this.$router.replace("/user/login")
          }
        }
      }
    },
    lookTeamInfo(team) {
      this.$router.push({ path: "/team/info", query: { tid: team.id } });
    },
    async delExpireTeamByTeamId(teamId) {
      const res = await delExpireTeam(teamId);
      if (res.code === 20000) {
        showToast("删除成功")
        this.$emit('reloadPage', 3)
      }
    },
    onLoadData() {
      this.$emit('onLoadData', "load")
    }
  }
}
</script>

<style scoped>
.teamCard {
  box-shadow: rgba(6, 24, 44, 0.07) 0px 0px 0px 2px, rgba(6, 24, 44, 0.45) 0px 4px 6px -1px, rgba(255, 255, 255, 0.06) 0px 1px 0px inset;
  border-radius: 10px;
  width: 90%;
  margin: auto;
}
</style>