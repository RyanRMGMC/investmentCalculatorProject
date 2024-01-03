function convertToMonhlyReturnRate(yearlyReturnRate){
    return yearlyReturnRate ** (1/12);
};

export function generateReturnsArray(
    startingAmount = 0, 
    timeHorizon = 0, 
    timePeriod = 'monthly', 
    monthyContribuition = 0, 
    returnRate = 0, 
    returnTimeFrame = 'monthly'
    )
    {
        if(!timeHorizon || !startingAmount){
            throw new Error(
                'Investimento inicial e prazo devem ser preenchidos com valores positivos não nulos.'
                );
        }

        const finalReturnRate = 
            returnTimeFrame === 'monthly' 
                ? ((returnRate/100) + 1) 
                : convertToMonhlyReturnRate((returnRate/100) + 1);

        const finalTimeHorizon = timePeriod === 'monthly' ? timeHorizon : timeHorizon*12;

        const referenceInvestmentObject = {
            investedAmount: startingAmount,
            interestReturns: 0,
            totalInterestReturns: 0,
            month: 0,
            totalAmount: startingAmount
        };

        const returnsArray = [referenceInvestmentObject];
        for(let timeReference = 1; timeReference <= finalTimeHorizon; timeReference++){
            const totalAmount = 
                returnsArray[timeReference - 1].totalAmount * finalReturnRate + monthyContribuition;
            const interestReturns = returnsArray[timeReference - 1].totalAmount * finalReturnRate;
            const investedAmount = startingAmount + monthyContribuition * timeReference;
            const totalInterestReturns = totalAmount - investedAmount;

            returnsArray.push({
                investedAmount,
                interestReturns,
                totalInterestReturns,
                month: timeReference,
                totalAmount
            });
        };

        return returnsArray;
    };