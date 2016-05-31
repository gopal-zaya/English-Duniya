(function() {
    'use strict';

    angular
        .module('common')
        .factory('data', data);

    data.$inject = ['pouchDB', '$http', '$log'];

    /* @ngInject */
    function data(pouchDB, $http, $log) {
        var diagnosisQuestionsDB = pouchDB('diagnosisQuestions');
        var kmapsDB = pouchDB('kmaps');
        var diagLitmusMappingDB = pouchDB('diagLitmusMapping');
        var kmapsLevelsDB = pouchDB('kmapsLevels');

        var data = {
            createDiagnosisQuestionDB: createDiagnosisQuestionDB(),
            createKmapsDB: createKmapsDB(),
            createDiagLitmusMappingDB: createDiagLitmusMappingDB(),
            createKmapsLevelsDB: createKmapsLevelsDB(),
            getDiagnosisQuestionById: getDiagnosisQuestionById,
            getDiagnosisQuestionByLevelNSkill: getDiagnosisQuestionByLevelNSkill,
            getDiagnosisLitmusMapping: getDiagnosisLitmusMapping,
            getKmapsLevels: getKmapsLevels
            // diagnosisQuestionsDB: diagnosisQuestionsDB,
            // kmapsDB: kmapsDB,
            // diagLitmusMappingDB: diagLitmusMappingDB
        };

        return data;


        function createDiagnosisQuestionDB() {
            $http.get('templates/common/questions.json').success(function(data) {
                $log.debug('in createDiagnosisQuestionDB');
                diagnosisQuestionsDB.bulkDocs(data);
            });
        };

        function createKmapsDB() {
            $http.get('templates/common/kmaps.json').success(function(data) {
                $log.debug('in createKmapsDB');
                kmapsDB.bulkDocs(data);
            });
        };

        function createDiagLitmusMappingDB() {
            $http.get('templates/common/diagnosticLitmusMapping.json').success(function(data) {
                $log.debug('in createDiagLitmusMappingDB');
                diagLitmusMappingDB.put({ "_id": "diagnostic_litmus_mapping", "diagnostic_litmus_mapping": data[0] });
            });
        };

        function createKmapsLevelsDB() {
            $http.get('templates/common/kmapsLevels.json').success(function(data) {
                $log.debug('in createKmapsLevelsDB');
                kmapsLevelsDB.put({ "_id": "kmapsLevels", "kmapsLevels": data[0] });
            });
        };

        function getKmapsLevels() {
          var result = kmapsLevelsDB.get("kmapsLevels")
                        .then(function(doc){
                          return doc.kmapsLevels;
                        })
          return result;
        }

        function getDiagnosisLitmusMapping(){
          var result = diagLitmusMappingDB.get("diagnostic_litmus_mapping")
                        .then(function(doc){
                          return doc.diagnostic_litmus_mapping;
                        })
          return result;
        }

        function getDiagnosisQuestionByLevelNSkill(level, skill){

          var result = diagnosisQuestionsDB.query(function(doc, emit) { 
                          emit(doc.level, doc);
                        }, { key: level })
                        .then(function(res) {
                          $log.debug('inside', res, skill);
                          var docs = [];
                            for(var i=0;i<res.rows.length;i++){
                              if(res.rows[i]["value"]["skill_area"] == skill){
                                docs.push(res.rows[i]["value"]);
                              }
                            }
                          return docs;
                          })
                          .catch(function(err) { console.log(err); return null;})
          return result;
        }

        function getDiagnosisQuestionById(id) {

          var result = diagnosisQuestionsDB.get(String(id))
                        .then(function(doc){
                          return doc;
                        })
                        .catch(function(){
                          return null
                        });

          return result;
        }
    }
})();
