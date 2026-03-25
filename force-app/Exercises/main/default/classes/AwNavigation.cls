public with sharing class AwNavigation {
    @AuraEnabled(cacheable=true)
    public static List<Certification__c> getCertifications(){
        try {
            return [
                SELECT Id, Name, Number_of_Certified_Professionals__c
                FROM Certification__c
                WITH SECURITY_ENFORCED
                ORDER BY Name
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}