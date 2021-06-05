import container, { TYPES } from "~/services/container";
import SettingsService, {
  GroupUuidEnum,
  Setting,
  SettingUuidEnum,
} from "~/services/settings.service";

export default async function createDefaultSettingsHelper(): Promise<
  Record<string, Setting<any>>
> {
  const settingsService = container.get<SettingsService>(TYPES.SettingsService);

  const defaultSettings: Record<string, Setting<any>> = {
    [SettingUuidEnum.AUTOMATICALLY_LOCKING]: {
      uuid: SettingUuidEnum.AUTOMATICALLY_LOCKING,
      name: "Automatically lock LightTown",
      groupUuid: GroupUuidEnum.SECURITY,
      value: true,
    },
    [SettingUuidEnum.AUTOMATICALLY_LOCKING_WARNING]: {
      uuid: SettingUuidEnum.AUTOMATICALLY_LOCKING_WARNING,
      name:
        "LightTown will always lock when you quit your browser. Locking your device will not immediately lock LightTown.",
      groupUuid: GroupUuidEnum.SECURITY,
    },
    [SettingUuidEnum.LANGUAGE]: {
      uuid: SettingUuidEnum.LANGUAGE,
      name: "Language",
      groupUuid: GroupUuidEnum.GENERAL,
      value: { name: "English", format: "en-US" },
      valueVariants: [
        { name: "English", format: "en-US" },
        { name: "Русский", format: "ru-RU" },
      ],
    },
    [SettingUuidEnum.APPEARANCE]: {
      uuid: SettingUuidEnum.APPEARANCE,
      name: "Appearance",
      groupUuid: GroupUuidEnum.GENERAL,
      value: { name: "Match System", value: "match_system" },
      valueVariants: [
        { name: "Match System", value: "match_system" },
        { name: "Light", value: "light" },
        { name: "Dark", value: "dark" },
      ],
    },
  };

  return await settingsService.save(defaultSettings);
}
