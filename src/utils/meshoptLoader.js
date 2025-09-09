/**
 * meshopt 압축된 모델 파일 경로를 생성합니다.
 * @param {string} modelName - 모델 이름 (예: 'mainhome', 'A01', 'B01')
 * @returns {string} meshopt 압축된 모델 파일 경로
 */
export const getMeshoptModelPath = (modelName) => {
  return `/models/${modelName}-meshopt.glb`;
};
