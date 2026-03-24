public with sharing class CourseDeliveryLocations {
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getLocations(){
        try {
            return [SELECT Location__c, COUNT(Id) numDeliveries FROM Course_Delivery__c WHERE Location__c != null WITH SECURITY_ENFORCED GROUP BY Location__c];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}