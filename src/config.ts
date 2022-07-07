import { CoreConfigModel, load as coreLoad } from 'be-core';
import * as config from '../config/config.json';
import { merge } from 'lodash';

export class ConfigModel extends CoreConfigModel {
    // add more config properties here
}

const defaultConfig = () => {
    const defaultConfig = new ConfigModel();
    return defaultConfig;
};

export const load = (): ConfigModel => {
    return merge(coreLoad(), defaultConfig(), config);
};

export const get = (key: string) => {
    const config = load();
    return config[key] as any;
};
