/**
 * @description api管理 异步调度中心
 * @author yq
 * @date 2017/9/10 下午2:26
 */
import { put, call, fork, takeLatest, takeEvery } from 'redux-saga/effects';
import { QUERY_SUCCESS, QUERY_LIST, UPDATE, UPDATE_API_STATUS, CREATE, DELETE, BATCH_DELETE, UPDATE_API_STATE,
} from '../types/api';
import { UPDATE_STATE, HANDLE_SUCCESS, HANDLE_FAILED } from '../types/app';
import * as ApiService from '../../services/api';

/**
 * 新增
 * @param action
 * @returns {boolean}
 */
function* doCreate(action) {
  try {
    // 显示loading
    yield put({ type: UPDATE_STATE, payload: { loading: true } });
    // 新增操作
    yield call(ApiService.create, action.payload);
    // 隐藏模态框
    yield put({ type: UPDATE_API_STATE, payload: { modalVisible: false, } });
    // 显示修改成功
    yield put({ type: HANDLE_SUCCESS, payload: { msg: '新增成功' } });
    // 成功回调
    if (typeof action.cb === 'function') {
      action.cb();
    }
  } catch (error) {
    console.error(error);
    // If we get an error we send Redux the appropiate action and return
    yield put({ type: HANDLE_FAILED, payload: error });
    return false;
  } finally {
    // 隐藏loading
    yield put({ type: UPDATE_STATE, payload: { loading: false } });
  }
}

/**
 * 单个删除
 * @param action
 * @returns {boolean}
 */
function* doRemove(action) {
  try {
    // 显示loading
    yield put({ type: UPDATE_STATE, payload: { loading: true } });
    // 删除操作
    yield call(ApiService.remove, action.payload);
    // 显示成功信息
    yield put({ type: HANDLE_SUCCESS, payload: { msg: '删除成功' } });
    // 成功回调
    if (typeof action.cb === 'function') {
      action.cb();
    }
  } catch (error) {
    console.error(error);
    // If we get an error we send Redux the appropiate action and return
    yield put({ type: HANDLE_FAILED, payload: error });
    return false;
  } finally {
    // 隐藏loading
    yield put({ type: UPDATE_STATE, payload: { loading: false } });
  }
}

/**
 * 批量删除
 * @param action
 * @returns {boolean}
 */
function* doBatchRemove(action) {
  try {
    // 显示loading
    yield put({ type: UPDATE_STATE, payload: { loading: true } });
    // 删除操作
    yield call(ApiService.batchRemove, action.payload);
    // 显示成功信息
    yield put({ type: HANDLE_SUCCESS, payload: { msg: '删除成功' } });
    // 成功回调
    if (typeof action.cb === 'function') {
      action.cb();
    }
  } catch (error) {
    console.error(error);
    // If we get an error we send Redux the appropiate action and return
    yield put({ type: HANDLE_FAILED, payload: error });
    return false;
  } finally {
    // 隐藏loading
    yield put({ type: UPDATE_STATE, payload: { loading: false } });
  }
}

/**
 * 查询列表
 * @returns {boolean}
 */
function* doQueryList(action) {
  try {
    // 显示loading
    yield put({ type: UPDATE_STATE, payload: { loading: true } });
    const response = yield call(ApiService.queryList, action.payload);
    yield put({
      type: QUERY_SUCCESS,
      payload: {
        list: response.data.list,
        pagination: {
          current: Number(action.payload.page || 1),
          pageSize: Number(action.payload.pageSize || 10),
          total: response.data.total,
        },
      }
    });
  } catch (error) {
    console.error('查询列表失败：', error);
    // If we get an error we send Redux the appropiate action and return
    yield put({ type: HANDLE_FAILED, payload: error });
    return false;
  } finally {
    // 隐藏loading
    yield put({ type: UPDATE_STATE, payload: { loading: false } });
  }
}

/**
 * 更新
 * @param action
 * @returns {boolean}
 */
function* doUpdate(action) {
  try {
    // 显示loading
    yield put({ type: UPDATE_STATE, payload: { loading: true } });
    // 更新操作
    yield call(ApiService.update, action.payload);
    // 隐藏模态框
    yield put({ type: UPDATE_API_STATE, payload: { modalVisible: false, } });
    // 显示修改成功
    yield put({ type: HANDLE_SUCCESS, payload: { msg: '修改成功' } });
    // 成功回调
    if (typeof action.cb === 'function') {
      action.cb();
    }
  } catch (error) {
    console.error('修改失败：', error);
    // If we get an error we send Redux the appropiate action and return
    yield put({ type: HANDLE_FAILED, payload: error });
    return false;
  } finally {
    // 隐藏loading
    yield put({ type: UPDATE_STATE, payload: { loading: false } });
  }
}

/**
 * 更新api状态
 * @param action
 * @returns {boolean}
 */
function* doUpdateStatus(action) {
  try {
    // 显示loading
    yield put({ type: UPDATE_STATE, payload: { loading: true } });
    // 更新操作
    yield call(ApiService.updateStatus, action.payload);
    // 显示修改成功
    yield put({ type: HANDLE_SUCCESS, payload: { msg: '操作成功' } });
    // 成功回调
    if (typeof action.cb === 'function') {
      action.cb();
    }
  } catch (error) {
    console.error('操作失败：', error);
    // If we get an error we send Redux the appropiate action and return
    yield put({ type: HANDLE_FAILED, payload: error });
    return false;
  } finally {
    // 隐藏loading
    yield put({ type: UPDATE_STATE, payload: { loading: false } });
  }
}

/**
 * 新增 saga
 * @returns {boolean}
 */
export function* create() {
  yield takeLatest(CREATE, doCreate);
}

/**
 * 单个删除 saga
 * @returns {boolean}
 */
export function* remove() {
  yield takeLatest(DELETE, doRemove);
}

/**
 * 批量删除 saga
 * @returns {boolean}
 */
export function* batchRemove() {
  yield takeLatest(BATCH_DELETE, doBatchRemove);
}

/**
 * 查询列表 saga
 * @returns {boolean}
 */
export function* queryList() {
  yield takeLatest(QUERY_LIST, doQueryList);
}

/**
 * 更新 saga
 * @returns {boolean}
 */
export function* update() {
  yield takeLatest(UPDATE, doUpdate);
}

/**
 * 更新状态 saga
 * @returns {boolean}
 */
export function* updateStatus() {
  yield takeLatest(UPDATE_API_STATUS, doUpdateStatus);
}

export const apiSagas = [
  fork(queryList),
  fork(create),
  fork(update),
  fork(updateStatus),
  fork(remove),
  fork(batchRemove),
];
