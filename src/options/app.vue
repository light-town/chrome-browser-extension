<template>
  <ui-theme-provider :mode="themeMode">
    <ui-grid justify="center" class="settings-page">
      <app-card class="settings-page__app-card" />
      <ui-grid class="settings-page__settings" direction="column">
        <template v-if="!loading">
          <template v-for="group in formatedGroups">
            <item-group :key="group.uuid" :title="group.name">
              <template v-for="setting in group.settings">
                <component
                  :is="setting.component"
                  :key="setting.uuid"
                  :title="setting.name"
                  :value="setting.value"
                  :items="setting.valueVariants"
                  @input="(val) => handleChangeSettings(setting.uuid, val)"
                />
              </template>
            </item-group>
          </template>
        </template>
        <template v-else>
          <ui-grid align-items="center" justify="center">
            <ui-loading :size="24" />
          </ui-grid>
        </template>
      </ui-grid>
    </ui-grid>
  </ui-theme-provider>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapState } from "vuex";
import { UiGrid, UiThemeProvider, UiLoading } from "@light-town/ui";
import * as settingsActionTypes from "~/options/store/settings/types";
import AppCard from "./components/app-card/index.vue";
import ItemGroup from "./components/item-group/index.vue";
import DefaultItem from "./components/items/default/index.vue";
import ToggleItem from "./components/items/toggle-item/index.vue";
import SelectItem from "./components/items/select-item/index.vue";
import {
  GroupUuidEnum,
  Setting,
  SettingUuidEnum,
} from "~/services/settings.service";
import { Store } from "./store";
import ThemeService from "~/services/theme.service";

export default Vue.extend({
  name: "AppPage",
  components: {
    UiGrid,
    UiThemeProvider,
    UiLoading,
    AppCard,
    ItemGroup,
    ToggleItem,
    DefaultItem,
    SelectItem,
  },
  data() {
    return {
      loading: false,
      groups: {
        [GroupUuidEnum.SECURITY]: {
          uuid: GroupUuidEnum.SECURITY,
          name: "Security",
        },
        [GroupUuidEnum.GENERAL]: {
          uuid: GroupUuidEnum.GENERAL,
          name: "General",
        },
      },
    };
  },
  computed: {
    ...mapState({
      settings: (state: Store) => state.settings.all,
    }),
    themeMode() {
      const theme = this.settings[SettingUuidEnum.APPEARANCE].value.value;

      if (theme === "match_system") {
        return ThemeService.getPreferredColorScheme();
      }

      return theme;
    },
    formatedGroups() {
      return Object.values<{ uuid: string; name: string }>(this.groups).map(
        (group) => {
          const groupSettings: Setting<any>[] = Object.values<Setting<any>>(
            this.settings
          )
            .filter((setting) => setting.groupUuid === group.uuid)
            .map((setting) => {
              let component;

              switch (typeof setting.value) {
                case "boolean": {
                  component = "toggle-item";
                  break;
                }
                case "object": {
                  if (Array.isArray(setting.valueVariants)) {
                    component = "select-item";
                  }

                  if (setting.uuid === SettingUuidEnum.APPEARANCE) {
                    return {
                      ...setting,
                      name: this.$t(setting.name),
                      value: {
                        ...setting.value,
                        name: this.$t(setting.value.name),
                      },
                      valueVariants: setting.valueVariants.map((v) => ({
                        ...v,
                        name: this.$t(v.name),
                      })),
                      component,
                    };
                  }

                  break;
                }
                default: {
                  component = "default-item";
                }
              }

              return {
                ...setting,
                name: this.$t(setting.name),
                component,
              };
            });

          return {
            ...group,
            name: this.$t(group.name),
            settings: groupSettings,
          };
        }
      );
    },
  },
  async created() {
    this.loading = true;

    await this.getSettings();

    this.$i18n.locale = this.settings[SettingUuidEnum.LANGUAGE].value.format;

    this.loading = false;
  },
  methods: {
    ...mapActions({
      getSettings: settingsActionTypes.GET_SETTINGS,
      updateSettings: settingsActionTypes.UPDATE_SETTINGS,
    }),
    handleChangeSettings(uuid, val) {
      this.settings[uuid].value = val;

      if (uuid === SettingUuidEnum.LANGUAGE)
        this.$i18n.locale = this.settings[uuid].value.format;

      this.updateSettings({ settings: this.settings });
    },
  },
});
</script>

<style lang="scss" src="./app.scss"></style>
