// link: https://github.com/sindresorhus/is-docker

import { statSync, readFileSync } from "fs";
import { isUndefined } from "../utils/types";

const hasDockerEnv = (): boolean => {
  try {
    statSync("/.dockerenv");
    return true;
  } catch {
    return false;
  }
};

const hasDockerCGroup = (): boolean => {
  try {
    return (
      readFileSync("/proc/self/group", "utf8")
        .includes("docker")
    );
  } catch {
    return false;
  }
}

const getInsideDocker = (): boolean => {
  return (
    hasDockerEnv() ||
      hasDockerCGroup()
  );
};

/** Флаг, хранящийся на уровне модуля */
let cachedFlag: boolean | undefined;

/**
 * Возвращает true, если выполнение происходит
 * внутри docker-контейнера
 *
 * @returns boolean
 */
export const isInsideDocker = (): boolean => {
  if (isUndefined(cachedFlag)) {
    cachedFlag = getInsideDocker();
  }

  return cachedFlag;
}

