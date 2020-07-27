var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
var dateFormat = require('dateformat');
var util = require('../common/utility')
const fs = require('fs')
const axios = require('axios')
const logger = log4js.getLogger('logger');
const errorlogger = log4js.getLogger('errorlogger');
const async = require('async');
var skype = require('../common/skype')


module.exports = {
    getStockAccountsListHyper(req, callback) {

        logger.debug('getStockAccountsListHyper');

        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        pool.getConnection(function (err, connection) {

            if (err) {
                errorlogger.error("An error occurred: " + err);
                response.return_code = 1;
                response.return_message = "Error getting Stock account details.";
                connection.release();
                callback(response);

            }
            connection.query(config.hyperloop.getStockAccountsListHyper, [util.getuserId(req.headers.token)], function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    connection.release();
                    response.return_code = 1;
                    response.return_message = "Error Retrieving Stock Accounts"
                    callback(response);

                } else {
                    logger.debug(rows[0]);
                    response.data = rows[0];
                    connection.release();
                    callback(response);
                }
            }); //Close: connection Query

        });//Close: Connection Pool
    },
    async getStockAccountsListHyperAsync() {
        var req = {
            headers: {
                token: 'BATCHUSER'
            },
        }
        return new Promise((resolve, reject) => {
            module.exports.getStockAccountsListHyper(req, function (result) {
                resolve(result)
            });
        })
    },
    async getOrders(url, key, accountID) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        };
        try {
            var res = await axios.get(`${url}accounts/${accountID}/orders`, {
                params: {
                    //instrument: "EUR_USD",
                    state: 'ALL',
                    count: 500
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${key}`
                }
            });
            if (res.status == 200) {
                response.data = res.data.orders;
                return response;

            }
            else {
                logger.error("Error Getting order Details")
                response.return_code = 1;
                response.return_message = "Error Getting order Details";
                return response;

            }
        }
        catch (err) {
            response.return_code = 1;
            response.return_message = err;
            logger.error(err);
            return response;
        }

    },
    async getTrades(url, key, accountID) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        };
        try {
            var res = await axios.get(`${url}accounts/${accountID}/trades`, {
                params: {
                    //instrument: "EUR_USD",
                    state: 'ALL',
                    count: 500
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${key}`
                }
            });
            if (res.status == 200) {
                response.data = res.data.trades;
                return response;

            }
            else {
                logger.error("Error Getting order Details")
                response.return_code = 1;
                response.return_message = "Error Getting order Details";
                return response;

            }
        }
        catch (err) {
            response.return_code = 1;
            response.return_message = err;
            logger.error(err);
            return response;
        }

    },
    async getPositions(url, key, accountID) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        };
        try {
            var res = await axios.get(`${url}accounts/${accountID}/positions`, {
                params: {
                    //instrument: "EUR_USD",
                    state: 'ALL',
                    count: 500
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${key}`
                }
            });
            if (res.status == 200) {
                response.data = res.data.positions;
                return response;

            }
            else {
                logger.error("Error Getting order Details")
                response.return_code = 1;
                response.return_message = "Error Getting order Details";
                return response;

            }
        }
        catch (err) {
            response.return_code = 1;
            response.return_message = err;
            logger.error(err);
            return response;
        }

    },
    async saveOrders(orders, username) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {

                if (err) {

                    logger.error("An error occurred: " + err);
                    response.return_message = "Error getting DB connection"
                    response.return_code = 1
                    callback(response);
                    return;
                }
                else {
                    connection.query(config.hyperloop.insertOrdersHyper, [orders, username], function (err, rows) {
                        if (err) {
                            errorlogger.error(err);
                            response.return_message = "Error saving Orders";
                            response.return_code = 1;
                            connection.release();
                            resolve(response);
                        } else {
                            logger.debug(rows);
                            response.data = rows[0];
                            connection.release();
                            resolve(response);
                        }
                    }
                    );
                } //Close: Else
            }); //Close: Pool
        });
    },
    async saveTrades(trades, username) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {

                if (err) {

                    logger.error("An error occurred: " + err);
                    response.return_message = "Error getting DB connection"
                    response.return_code = 1
                    callback(response);
                    return;
                }
                else {
                    connection.query(config.hyperloop.insertTradesHyper, [trades, username], function (err, rows) {
                        if (err) {
                            errorlogger.error(err);
                            response.return_message = "Error saving Trades";
                            response.return_code = 1;
                            connection.release();
                            resolve(response);
                        } else {
                            logger.debug(rows);
                            response.data = rows[0];
                            connection.release();
                            resolve(response);
                        }
                    }
                    );
                } //Close: Else
            }); //Close: Pool
        });
    },
    async updateOrders(account_id, url, key, env_type, username) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        };
        try {
            var orderres = await module.exports.getOrders(url, key, account_id)
            if (orderres.return_code != 0) {
                logger.error("Error getting Order Details");
                logger.error(res.return_message);
                return response;
            }
        }
        catch (ex) {
            logger.error("Error getting Order Details");
            logger.error(ex);
            return response;
        }
        var values = [];
        for (var j = 0; j < orderres.data.length; j++) {
            var order = orderres.data[j];
            if (order.type != 'TAKE_PROFIT' && order.type != 'STOP_LOSS') {
                var stock_code = order.instrument;
                var order_id = order.id;
                var create_time = (order.createTime !== undefined) ? dateFormat(new Date(order.createTime).toLocaleString(), "yyyy-mm-dd H:MM:ss") : null;
                var type = order.type;
                var units = order.units;
                var price = order.price;
                var time_in_force = order.timeInForce;
                var trigger_condition = order.triggerCondition;
                var partial_fill = order.partialFill;
                var position_fill = order.positionFill;
                var state = order.state;
                var filling_id = (order.fillingTransactionID !== undefined) ? order.fillingTransactionID : null;
                var filling_time = (order.filledTime !== undefined) ? dateFormat(new Date(order.filledTime).toLocaleString(), "yyyy-mm-dd H:MM:ss") : null;
                var trade_opened_id = order.tradeOpenedID;
                var tp_price = (order.takeProfitOnFill !== undefined) ? order.takeProfitOnFill.price : null;
                var tp_time_in_force = (order.takeProfitOnFill !== undefined) ? order.takeProfitOnFill.timeInForce : null;
                var sl_price = (order.stopLossOnFill !== undefined) ? order.stopLossOnFill.price : null;
                var sl_time_in_force = (order.stopLossOnFill !== undefined) ? order.stopLossOnFill.timeInForce : null;
                var cancell_id = (order.cancellingTransactionID !== undefined) ? order.cancellingTransactionID : null;
                var cancell_time = (order.cancelledTime !== undefined) ? dateFormat(new Date(order.cancelledTime).toLocaleString(), "yyyy-mm-dd H:MM:ss") : null;
                var value = [];
                value.push(stock_code, env_type, account_id, order_id, create_time, type, units,
                    price, time_in_force, trigger_condition, partial_fill, position_fill, state,
                    filling_id, filling_time, trade_opened_id,
                    tp_price, tp_time_in_force, sl_price, sl_time_in_force, cancell_time, cancell_id,
                    username, dateFormat(new Date(), "yyyy-mm-dd H:MM:ss"));
                values.push(value);
            }
        }
        if (values.length > 0) {
            var saveres = await module.exports.saveOrders(values, username)
            //console.log(saveres);
            //logger.info(saveres);
            return saveres;
        }
        else {
            return response;
        }

    },
    async updateTrades(account_id, url, key, env_type, username) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        };
        try {
            var traderes = await module.exports.getTrades(url, key, account_id)
            if (traderes.return_code != 0) {
                logger.error("Error getting Trade Details");
                logger.error(res.return_message);
                return response;
            }
        }
        catch (ex) {
            logger.error("Error getting Trade Details");
            logger.error(ex);
            return response;
        }
        var values = [];
        for (var j = 0; j < traderes.data.length; j++) {
            var trade = traderes.data[j];
            //logger.info(trade);
            var stock_code = trade.instrument;
            var trade_id = trade.id;
            var price = trade.price;
            var openTime = (trade.openTime !== undefined) ? dateFormat(new Date(trade.openTime).toLocaleString(), "yyyy-mm-dd H:MM:ss") : null;
            var initialUnits = trade.initialUnits;
            var initialMarginRequired = trade.initialMarginRequired;
            var state = trade.state;
            var currentUnits = trade.currentUnits;
            var realizedPL = trade.realizedPL;
            var financing = trade.financing;
            var dividendAdjustment = trade.dividendAdjustment;
            var unrealizedPL = trade.unrealizedPL;
            var marginUsed = trade.marginUsed;
            var closingTransactionIDs = (trade.closingTransactionIDs !== undefined) ? trade.closingTransactionIDs.join() : null;
            var closeTime = (trade.closeTime !== undefined) ? dateFormat(new Date(trade.closeTime).toLocaleString(), "yyyy-mm-dd H:MM:ss") : null;
            var averageClosePrice = trade.averageClosePrice;
            var tp_id = (trade.takeProfitOrder !== undefined) ? trade.takeProfitOrder.id : null;
            var tp_createTime = (trade.takeProfitOrder !== undefined) ? dateFormat(new Date(trade.takeProfitOrder.createTime).toLocaleString(), "yyyy-mm-dd H:MM:ss") : null;
            var tp_type = (trade.takeProfitOrder !== undefined) ? trade.takeProfitOrder.type : null;
            var tp_tradeID = (trade.takeProfitOrder !== undefined) ? trade.takeProfitOrder.tradeID : null;
            var tp_price = (trade.takeProfitOrder !== undefined) ? trade.takeProfitOrder.price : null;
            var tp_timeInForce = (trade.takeProfitOrder !== undefined) ? trade.takeProfitOrder.timeInForce : null;
            var tp_triggerCondition = (trade.takeProfitOrder !== undefined) ? trade.takeProfitOrder.triggerCondition : null;
            var tp_state = (trade.takeProfitOrder !== undefined) ? trade.takeProfitOrder.state : null;
            var tp_cancellingTransactionID = (trade.takeProfitOrder !== undefined) ? trade.takeProfitOrder.cancellingTransactionID : null;
            var tp_cancelledTime = (trade.takeProfitOrder !== undefined) ? ((trade.takeProfitOrder.cancelledTime !== undefined) ? dateFormat(new Date(trade.takeProfitOrder.cancelledTime).toLocaleString(), "yyyy-mm-dd H:MM:ss") : null) : null;
            var tp_fillingTransactionID = (trade.takeProfitOrder !== undefined) ? trade.takeProfitOrder.fillingTransactionID : null;
            var tp_filledTime = (trade.takeProfitOrder !== undefined) ? ((trade.takeProfitOrder.filledTime !== undefined) ? dateFormat(new Date(trade.takeProfitOrder.filledTime).toLocaleString(), "yyyy-mm-dd H:MM:ss") : null) : null;
            var tp_tradeClosedIDs = (trade.takeProfitOrder !== undefined && trade.takeProfitOrder.tradeClosedIDs !== undefined) ? trade.takeProfitOrder.tradeClosedIDs.join() : null;

            var sl_id = (trade.stopLossOrder !== undefined) ? trade.stopLossOrder.id : null;
            var sl_createTime = (trade.stopLossOrder !== undefined) ? dateFormat(new Date(trade.stopLossOrder.createTime).toLocaleString(), "yyyy-mm-dd H:MM:ss") : null;
            var sl_type = (trade.stopLossOrder !== undefined) ? trade.stopLossOrder.type : null;
            var sl_tradeID = (trade.stopLossOrder !== undefined) ? trade.stopLossOrder.tradeID : null;
            var sl_price = (trade.stopLossOrder !== undefined) ? trade.stopLossOrder.price : null;
            var sl_timeInForce = (trade.stopLossOrder !== undefined) ? trade.stopLossOrder.timeInForce : null;
            var sl_triggerCondition = (trade.stopLossOrder !== undefined) ? trade.stopLossOrder.triggerCondition : null;
            var sl_state = (trade.stopLossOrder !== undefined) ? trade.stopLossOrder.state : null;
            var sl_cancellingTransactionID = (trade.stopLossOrder !== undefined) ? trade.stopLossOrder.cancellingTransactionID : null;
            var sl_cancelledTime = (trade.stopLossOrder !== undefined) ? ((trade.stopLossOrder.cancelledTime !== undefined) ? dateFormat(new Date(trade.stopLossOrder.cancelledTime).toLocaleString(), "yyyy-mm-dd H:MM:ss") : null) : null;
            var sl_fillingTransactionID = (trade.stopLossOrder !== undefined) ? trade.stopLossOrder.fillingTransactionID : null;
            var sl_filledTime = (trade.stopLossOrder !== undefined) ? ((trade.stopLossOrder.filledTime !== undefined) ? dateFormat(new Date(trade.stopLossOrder.filledTime).toLocaleString(), "yyyy-mm-dd H:MM:ss") : null) : null;
            var sl_tradeClosedIDs = (trade.stopLossOrder !== undefined && trade.stopLossOrder.tradeClosedIDs !== undefined) ? trade.stopLossOrder.tradeClosedIDs.join() : null;



            var value = [];
            value.push(stock_code, env_type, account_id, trade_id, price, openTime, initialUnits, initialMarginRequired, state, currentUnits, realizedPL,
                financing, dividendAdjustment, unrealizedPL, marginUsed, closingTransactionIDs, closeTime, averageClosePrice, tp_id, tp_createTime, tp_type,
                tp_tradeID, tp_price, tp_timeInForce, tp_triggerCondition, tp_state, tp_cancellingTransactionID, tp_cancelledTime, tp_fillingTransactionID,
                tp_filledTime, tp_tradeClosedIDs, sl_id, sl_createTime, sl_type, sl_tradeID, sl_price, sl_timeInForce, sl_triggerCondition, sl_state,
                sl_cancellingTransactionID, sl_cancelledTime, sl_fillingTransactionID, sl_filledTime, sl_tradeClosedIDs,
                username, dateFormat(new Date(), "yyyy-mm-dd H:MM:ss"));
            values.push(value);

        }
        if (values.length > 0) {
            var saveres = await module.exports.saveTrades(values, username)
            //console.log(saveres);
            //logger.info(saveres);
            return saveres;
        }
        else {
            return response;
        }

    },
    async updateAllOrders() {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        };
        var username = 'BATCHUSER'
        try {
            var res = await module.exports.getStockAccountsListHyperAsync()
            if (res.return_code != 0) {
                logger.error("Error getting Stock Accounts");
                logger.error(res.return_message);
                return response;

            }
        }
        catch (ex) {
            logger.error("Error getting Stock Accounts");
            logger.error(ex);
            return response;
        }
        //console.log(res.data);
        for (var i = 0; i < res.data.length; i++) {
            var account_id = res.data[i].ACCOUNT_ID;
            var url = res.data[i].ACCOUNT_URL;
            var key = res.data[i].ACCOUNT_KEY;
            var env_type = res.data[i].ENV_TYPE;
            await module.exports.updateOrders(account_id, url, key, env_type, username);
            await module.exports.updateTrades(account_id, url, key, env_type, username);
        }
        return response

    }

}
//module.exports.getOrders('101-001-13428606-001');
module.exports.updateAllOrders();