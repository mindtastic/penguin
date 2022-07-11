import { ServiceMap } from '../map/types';
import penguinMock from './penguin.json';

export const fetchServiceMap = () => penguinMock as ServiceMap;

export default {
  fetchServiceMap,
};
