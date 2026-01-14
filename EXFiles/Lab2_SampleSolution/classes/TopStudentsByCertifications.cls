public with sharing class TopStudentsByCertifications {
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getTopStudentsByCertCount() {
        return [
            SELECT Certified_Professional__c,
                   Certified_Professional__r.Name,
                   Certified_Professional__r.Email,
                   Certified_Professional__r.Phone,
                   COUNT(Id)
            FROM Certification_Held__c
            GROUP BY Certified_Professional__c,
                     Certified_Professional__r.Name,
                     Certified_Professional__r.Email,
                     Certified_Professional__r.Phone
            ORDER BY COUNT(Id) DESC
            LIMIT 5
        ];
    }
}