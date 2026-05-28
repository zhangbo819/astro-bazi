import { computed, ref, shallowRef, watch } from 'vue';
import { defineStore } from 'pinia';
import { TG, DZ, Ten, NaYin, Shensha, paipan, textJSON, JZ_60, TG_10 } from 'astro-bazi-utils';

import { useAstroStore } from './astro';
import { PillarItem, PillarTitle, Sizhu } from '@/views/Workspace/Bazi/constant';

export const useBaziStore = defineStore('bazi', () => {
  const astrologyStore = useAstroStore(); // TODO remove time to common

  const sex = ref<0 | 1>(0);

  // 总数据
  const paipanInfo = shallowRef(paipan.GetInfo(sex.value, astrologyStore.time.getTime()));
  // console.log(paipanInfo.value);
  watch([() => astrologyStore.time, () => sex.value], () => {
    paipanInfo.value = paipan.GetInfo(sex.value, astrologyStore.time.getTime());
  });

  const pillarData = shallowRef<PillarItem[]>([]);
  const setPillarData = (cb: (s: PillarItem[]) => PillarItem[]) => {
    pillarData.value = cb(pillarData.value);
    // console.log('pillarData.value', pillarData.value);
  };
  watch(
    () => paipanInfo.value,
    () => {
      pillarData.value = Sizhu.map<PillarItem>((title, i) => {
        let zhuxing = paipanInfo.value.tenMap[paipanInfo.value.tg[i]];
        if (title === PillarTitle.日柱) {
          zhuxing = paipanInfo.value.gender === 0 ? Ten.元男 : Ten.元女;
        }
        return {
          title,
          isShow: true,
          zhuxing: zhuxing,
          tg: paipanInfo.value.bazi[i][0] as TG,
          dz: paipanInfo.value.bazi[i][1] as DZ,
          dzcg: paipanInfo.value.dzcg_text[i],
          fx: paipanInfo.value.dzcg[i],
          fx_text: paipanInfo.value.dzcg[i].map((f) => paipanInfo.value.tenMap[f]),
          xingyun: NaYin.getXingYun(paipanInfo.value.bazi[i], paipanInfo.value.bazi[2][0] as TG),
          zizuo: NaYin.getXingYun(paipanInfo.value.bazi[i], paipanInfo.value.bazi[i][0] as TG),
          nayin: NaYin.getNayin(paipanInfo.value.bazi[i]),
          ss: Shensha.getData(
            paipanInfo.value.bazi,
            paipanInfo.value.bazi[i],
            paipanInfo.value.yinli,
            paipanInfo.value.gender
          ),
        };
      });
    },
    { immediate: true }
  );

  const pillarShowData = computed(() => {
    return pillarData.value.filter((i) => i.isShow);
  });

  // 获取四柱外的某一列数据
  const getListDataItem = (name: JZ_60, title: PillarTitle) => {
    const { dzcg, dzcg_text } = paipan.getDzcgText(
      [name].map((item) => {
        const i = paipan.cdz.findIndex((j) => j === item?.[1]);
        return i;
      })
    );
    const dyZhuxingIndex = TG_10.findIndex((j) => j === name[0]);

    const dyItem = {
      title,
      isShow: false,
      zhuxing: paipanInfo.value.tenMap[dyZhuxingIndex],
      tg: name[0] as TG,
      dz: name[1] as DZ,
      dzcg: dzcg_text[0],
      fx: dzcg[0],
      fx_text: dzcg[0].map((f) => paipanInfo.value.tenMap[f]),
      xingyun: NaYin.getXingYun(name, paipanInfo.value.bazi[2][0] as TG),
      zizuo: NaYin.getXingYun(name, name[0] as TG),
      nayin: NaYin.getNayin(name),
      ss: Shensha.getData(
        paipanInfo.value.bazi,
        name,
        paipanInfo.value.yinli,
        paipanInfo.value.gender
      ),
    };
    return dyItem;
  };

  // 弹窗
  const dialogVisible = ref(false);
  const dialogTitle = ref('');
  const dialogText = ref('');

  const openDialog = (options?: { title?: string; text?: string }) => {
    const { text, title } = options || {};
    dialogVisible.value = true;
    dialogTitle.value = title || text || '';

    if (typeof text !== 'undefined' && textJSON[text]) {
      dialogText.value = textJSON[text];
    } else {
      dialogText.value = text || '';
    }
  };

  return {
    paipanInfo,
    pillarData,
    setPillarData,
    pillarShowData,
    getListDataItem,
    sex,
    dialogVisible,
    dialogTitle,
    dialogText,
    openDialog,
  };
});
