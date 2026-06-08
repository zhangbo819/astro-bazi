<template>
  <div style="width: 100%">
    <van-collapse v-model="activeTab">
      <van-nav-bar right-text="星盘详情" @click-right="onClickRight">
        <template #left>
          <van-button
            type="primary"
            plain
            style="--van-button-border-width: 0"
            @click="onClickLeft"
            :loading="loading"
            loading-text="加载中..."
            >AI 解读</van-button
          >
        </template>
        <template #title>
          <h1 style="font-size: 1.6em; line-height: 1.6em">Astrology</h1>
        </template>
      </van-nav-bar>

      <!-- 星座盘 -->
      <astro-round-plate :data="data" />

      <!-- 操作栏 -->
      <h2>操作栏</h2>
      <astro-operation v-model:time="time" />

      <!-- <van-collapse-item name="5">
        <template #title></template>
      </van-collapse-item> -->

      <!-- 参数详情列表 -->
      <van-collapse-item name="2">
        <template #title>
          <h2>参数详情列表</h2>
        </template>
        <van-cell-group inset>
          <van-cell
            v-for="item in data"
            :key="item.name"
            :title="`${item.name} ${planentsMap[item.name].name}`"
            :title-style="{ color: planentsMap[item.name].color }"
          >
            <template #label>
              <span :style="{ color: DignityMap[item.dignity].color }">{{
                DignityMap[item.dignity].text
              }}</span>
            </template>

            <p class="value" :style="{ color: map12[item.sign].color }">
              {{ item.sign }} {{ map12[item.sign].name }}
              <span v-if="item.retrograde">R</span>
            </p>

            <p class="value">{{ item.degree }}°</p>
          </van-cell>
        </van-cell-group>
      </van-collapse-item>
    </van-collapse>
  </div>

  <van-popup v-model:show="showDialog" round class="interpret-popup" teleport="body">
    <div v-if="!loading" class="markdown-body" v-html="renderMarkdown(result)" />
    <div v-show="loading" style="margin-top: 16px">
      <van-loading
        color="var(--global-theme-color)"
        size="32px"
        vertical
        style="--van-padding-xs: 12px"
        >解读生成中...</van-loading
      >
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import router from '@/router';
import { getAllPlanets } from '@/utils/astro/planets';
import { DignityMap, map12, planentsMap } from '@/utils/astro/astroUI';
import AstroOperation from '@/views/Workspace/Astrology/components/AstroOperation.vue';
import AstroRoundPlate from '@/views/Workspace/Astrology/components/AstroRoundPlate.vue';
import { renderMarkdown } from '@/utils/util';

// const time = ref(new Date('2013-07-29T04:30:00Z'));
// const time = ref(new Date('2010-08-07T00:00:00Z'));
const time = ref(new Date(1994, 7, 19, 5, 20));

const data = computed(() => {
  return getAllPlanets(time.value);
});

const activeTab = ref(new Array(6).fill(0).map((_, i) => String(i + 1)));
const onClickRight = () => {
  // 将秒和毫秒清零，方便浏览器保存参数
  const newDate = new Date(time.value);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);

  router.push({
    path: '/workspace',
    query: { time: newDate.getTime(), tab: 0 },
  });
};

const loading = ref(false);
const result = ref('');
const showDialog = ref(false);

async function runInterpret(chart: Record<string, any> | Record<string, any>[]) {
  loading.value = true;

  const res = await fetch('/api/interPret', {
    method: 'POST',
    body: JSON.stringify(chart),
  });

  // console.log('res', res);
  if (res.status === 200) {
    const data = await res.json();
    result.value = data.text;
    loading.value = false;
    showDialog.value = true;
  } else {
    loading.value = false;
    result.value = '出错了: ' + res.status + ' ' + res.statusText;
    showDialog.value = true;

    // result.value =
    //   '您好！感谢您提供这份本命盘信息。\n\n根据您提供的JSON格式信息 `{"chart":{"name":"Pluto","sign":"Aquarius"}}`，唯一明确的占星学数据是“Aquarius”（水瓶座）。在专业的西洋占星解读中，如果只提供一个星座，通常默认指的是**太阳星座**，因为它代表了核心自我、意志和生命能量。\n\n因此，我将以**太阳落在水瓶座**为基础，为您进行这份初步的解读。请注意，一个完整的本命盘解读需要包括出生日期、时间、地点，才能计算出所有行星的精确位置、宫位以及相位，从而提供更深入和个性化的分析。此解读仅基于太阳星座，具有普遍性。\n\n---\n\n**核心人格 (Core Personality)**\n\n*   **独立且原创的思考者：** 您的核心自我驱动力在于独立思考和表达自己的独特视角。您不轻易随波逐流，拥有前瞻性和革新精神，渴望在思想和行为上保持原创性。\n*   **人道主义情怀：** 您对集体、社会公平和人类福祉抱有深刻的关怀。您可能被社会议题、科学进步或任何能改善人类境况的运动所吸引。\n*   **理性与客观：** 您倾向于以超然、客观的态度看待事物，情感表达可能较为内敛，更注重逻辑和事实。您可能会将个人情感融入更宏大的理念之中。\n*   **自由的追求者：** 您极度珍视个人自由和空间，厌恶被束缚或限制。您需要有足够的自主权去探索和实践自己的想法。\n\n**情绪模式 (Emotional Mode)**\n\n*   **理智化处理情感：** 您的情绪往往通过大脑进行过滤和分析，而不是直接流露。您可能需要时间来理解和消化自己的感受，有时会显得疏离或超然。\n*   **对群体共情，对个体保持距离：** 您可能对大众的困境感同身受，但对于亲近的人，在情感表达上可能显得不够热烈或难以深入。您更倾向于通过共同的理想和兴趣来建立情感连接。\n*   **情绪波动可能突然：** 作为风象固定星座，您的情绪通常是稳定的，但当感到自由受限或理想被挑战时，可能会出现突然的反叛或情绪爆发。\n*   **需求理解而非感同身受：** 您可能更希望对方理解您的思想和观点，而不是单纯地对您的情绪感同身受。\n\n**行动力 (Action Drive)**\n\n*   **为理想而行动：** 您的行动力源于对理想、创新和改革的信念。您不是为了个人私利而行动，而是为了实现某种宏大愿景或推动社会进步。\n*   **策略性与非传统：** 您在达成目标时倾向于采用不寻常或创新的方法。您喜欢制定策略，并以一种独特的方式去执行，不拘泥于传统。\n*   **团队合作与独立并存：** 您擅长在团队中发挥作用，尤其是在有共同目标和愿景的群体中。但同时，您也需要足够的独立空间去执行自己的想法。\n*   **间歇性的爆发力：** 您的行动力可能不是持续性的，而是在受到灵感激发或找到某个突破口时，展现出强大的爆发力和推进力。\n\n**人际关系 (Interpersonal Relationships)**\n\n*   **友谊重于一切：** 对您而言，友谊是人际关系的核心。您看重志同道合的朋友，并乐于与他们分享思想和理想。\n*   **平等与尊重：** 您在关系中追求平等和相互尊重，厌恶任何形式的控制或不公。您会吸引那些独立、有趣且思维开放的人。\n*   **需要空间和自由：** 即使在最亲密的关系中，您也需要保持一定的独立性和私人空间。过度黏腻或缺乏自由的关系会让您感到窒息。\n*   **可能显得疏离：** 您在亲密关系中可能不会表现出过多的情感依恋，有时会让人觉得难以接近或不够热情。您更喜欢通过共同的活动和思想交流来维系关系。\n\n**成长方向 (Growth Direction)**\n\n*   **平衡理想与现实：** 您的成长在于学习如何将崇高的理想和人道主义情怀落实到具体的行动中，并与现实世界建立更实际的连接。\n*   **深化情感表达：** 学习如何更开放、更直接地表达个人情感，而非总是通过理智或群体视角来处理。允许自己在亲密关系中变得更脆弱、更投入。\n*   **接纳个人局限：** 尽管渴望自由和独立，但也要学会在特定关系或责任中找到平衡，理解并非所有的承诺都是束缚。\n*   **学会温暖他人：** 将对人类整体的爱，转化为对身边个体的具体关怀和温暖，弥合客观分析与情感链接之间的距离。\n*   **整合个性与归属感：** 找到在保持自己独特个性的同时，也能真正融入群体并感受到深层归属感的方式。\n\n---\n\n希望这份解读能为您带来一些启发！如果您能提供更详细的出生信息，我将非常乐意为您进行更全面和细致的本命盘分析。';
  }
}

const onClickLeft = () => {
  const param = data.value.map(({ name, sign, retrograde, dignity }) => {
    const item: Record<string, string | boolean> = { name, sign };
    if (retrograde) {
      item.retrograde = retrograde;
    }
    if (dignity !== 'Peregrine') {
      item.dignity = dignity;
    }
    return item;
  });
  // console.log(param);

  runInterpret(param);
};
</script>

<style lang="scss" scoped>
p,
h1 {
  margin: 0;
}

h2 {
  text-align: center;
}

.value {
  margin: 0;
  // font-weight: bold;
  > span {
    color: #666;
  }
}

.interpret-popup {
  max-height: 90%;
  max-width: 90%;
  padding: 16px;
}
</style>
