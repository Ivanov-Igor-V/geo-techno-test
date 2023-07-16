<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import InputText from 'primevue/inputtext';
import Paginator from 'primevue/paginator';
import Card from 'primevue/card';
import Avatar from 'primevue/avatar';
import Checkbox from 'primevue/checkbox';
import { useEventListener, onClickOutside } from '@vueuse/core';

import {
  ref, computed, onUnmounted, watchEffect,
} from 'vue';

interface Entry {
  date: Date,
  isRead?: boolean,
  priority: 'низкая' | 'высокая' | 'критическая',
  equipment: 'Вегас' | 'Коммутатор' | 'ИБП' | 'Трасформатор' | 'ЛВС' |'Люк',
  message: 'сервер недоступен' | 'потеряно соединение' | 'открыва крышка' |
   'назкий заряд батареи' | 'мало масла' |'обрыв кабеля'| 'нет подтверждения пуска',
  responsible: 'Прикрепите' | 'к заданию' | 'файл' | 'с данными'
   | 'чтобы я' | 'не печатал' | '3 года',
   id: number
}

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime()
        + Math.random() * (end.getTime() - start.getTime()));
}

const data = ref<Entry[]>([
  {
    date: randomDate(new Date(2012, 0, 1), new Date()),
    priority: 'высокая',
    equipment: 'Вегас',
    message: 'сервер недоступен',
    responsible: 'Прикрепите',
    id: 0,
    isRead: false,
  },
  {
    date: randomDate(new Date(2012, 0, 1), new Date()),
    priority: 'низкая',
    equipment: 'Коммутатор',
    message: 'потеряно соединение',
    responsible: 'к заданию',
    id: 1,
    isRead: false,

  },
  {
    date: randomDate(new Date(2012, 0, 1), new Date()),
    priority: 'высокая',
    equipment: 'ИБП',
    message: 'назкий заряд батареи',
    responsible: 'файл',
    id: 2,
    isRead: false,
  },

]);

const addedData = ref<Entry[]>([
  {
    date: randomDate(new Date(2012, 0, 1), new Date()),
    priority: 'критическая',
    equipment: 'Трасформатор',
    message: 'мало масла',
    responsible: 'с данными',
    id: 3,
    isRead: false,
  },
  {
    date: randomDate(new Date(2012, 0, 1), new Date()),
    priority: 'высокая',
    equipment: 'Люк',
    message: 'обрыв кабеля',
    responsible: 'чтобы я',
    id: 4,
    isRead: false,
  },
  {
    date: randomDate(new Date(2012, 0, 1), new Date()),
    priority: 'высокая',
    equipment: 'Люк',
    message: 'обрыв кабеля',
    responsible: 'не печатал',
    id: 5,
    isRead: false,
  },
  {
    date: randomDate(new Date(2012, 0, 1), new Date()),
    priority: 'высокая',
    equipment: 'Люк',
    message: 'обрыв кабеля',
    responsible: '3 года',
    id: 6,
    isRead: false,
  },
]);

// Search
const inputValue = ref('');

const searchedData = computed(
  () => data.value.filter((el) => el.message.includes(inputValue.value)),
);

// Entry adding timer

const timerUI = ref(5);
const timerId = setInterval(() => {
  timerUI.value -= 1;
}, 1000);

watchEffect(() => {
  if (timerUI.value === 0) {
    data.value.push(addedData.value[0]);
    addedData.value.shift();
    if (timerUI.value === 0 && !addedData.value.length) clearTimeout(timerId);
    timerUI.value = 5;
  }
});

// Pagination stuff

const cardCount = ref(4);
const startingIndex = ref(1);
const visibleCards = computed(
  () => searchedData.value.filter((el) => (el.id + 1 >= startingIndex.value
  && el.id + 1 < startingIndex.value + cardCount.value)),
);
const onPage = (e: any) => {
  if (e.page === 0) { startingIndex.value = 1; return; }
  startingIndex.value = e.page + 1 * cardCount.value;
};

const cardRef = ref();

const pickedCard = ref<Entry | null>(null);
const pickCard = (card: Entry) => {
  if (pickedCard.value) { if (pickedCard.value.id === card.id) pickedCard.value = null; return; }
  pickedCard.value = card;
};
const cardСomparison = (card: Entry) => {
  if (pickedCard.value) { return card.id === pickedCard.value.id; } return false;
};

const cleanup = useEventListener(document, 'keydown', (e) => {
  if (pickedCard.value && e.key === ' ') {
    const indexOfReadEntry = data.value.findIndex((entry) => entry.id === pickedCard.value.id);
    data.value[indexOfReadEntry].isRead = true;
  }
});

onClickOutside(cardRef, () => { pickedCard.value = null; });
onUnmounted(() => { cleanup(); clearTimeout(timerId); });
</script>
 dsa
<template>
  <div class="relative">
    <div class="">
      <div
        v-if="addedData.length"
        class="text-lg text-white"
      >
        До отправки новой записи: {{ timerUI }}
      </div>
      <InputText
        v-model="inputValue"
        class="my-3"
        type="text"
      />
    </div>

    <TabView>
      <TabPanel header="Таблица">
        <DataTable
          paginator
          :rows="5"
          class="m-auto mb-3"
          :value="searchedData"
          table-style="min-width: 50rem"
        >
          <Column
            field="date"
            header="Дата"
          />
          <Column
            field="priority"
            header="Важность"
          />
          <Column
            field="equipment"
            header="Оборудование"
          />
          <Column
            field="message"
            header="Сообщение"
          />
          <Column
            field="responsible"
            header="Ответственный"
          />
        </DataTable>
      </TabPanel>
      <TabPanel header="Карточки">
        <div class="mb-10 grid gap-10 sm:grid-cols-1 md:grid-cols-2">
          <Card
            v-for="(card) of visibleCards"
            :key="card.id"
            ref="cardRef"
            :class="{' bg-red': cardСomparison(card), 'bg-green' : card.isRead}"
            class="overflow-hidden"
            @click="pickCard(card)"
          >
            <template #content>
              <div class="flex gap-3">
                <div
                  class="max-w-4/5 flex flex-col items-start justify-center overflow-hidden"
                >
                  <div
                    class="max-w-7/10 truncate"
                    :title="card.date.toDateString()"
                  >
                    Дата: {{ card.date }}
                  </div>
                  <div class="max-w-7/10 truncate">
                    Важность: <Checkbox
                      :binary="true"
                      @click.stop
                    />  {{ card.priority }}
                  </div>
                  <div class="max-w-7/10 truncate">
                    Оборудование: {{ card.equipment }}
                  </div>
                  <div class=" max-w-7/10 truncate">
                    Сообщение: {{ card.message }}
                  </div>
                  <div v-if="card.isRead">
                    Просмотрено!!
                  </div>
                </div>
                <div>
                  <Avatar
                    image="../src/assets/truth.jpg"
                    class="mr-2 "
                    size="xlarge"
                    shape="circle"
                  />
                  <p class="truncate">
                    {{ card.responsible }}
                  </p>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <Paginator
          :rows="cardCount"
          :total-records="searchedData.length"
          @page="onPage($event)"
        />
      </TabPanel>
    </TabView>
  </div>
</template>
