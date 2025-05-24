
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CampaignLevelTable from './CampaignLevelTable';
import AdSetLevelTable from './AdSetLevelTable';
import AdLevelTable from './AdLevelTable';
import MetaAudienceTab from './MetaAudienceTab';
import MetaCreativeTab from './MetaCreativeTab';
import MetaBudgetTab from './MetaBudgetTab';
import { MetaAdsAccount } from './types';

interface MetaAdsTabsProps {
  accounts: MetaAdsAccount[];
  selectedAccount: MetaAdsAccount | null;
  onSelectAccount: (accountId: string) => void;
}

const MetaAdsTabs = ({ accounts, selectedAccount, onSelectAccount }: MetaAdsTabsProps) => {
  return (
    <Tabs defaultValue="campaigns" className="mt-6">
      <TabsList className="mb-4 w-full justify-start">
        <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        <TabsTrigger value="adsets">Ad Sets</TabsTrigger>
        <TabsTrigger value="ads">Ads</TabsTrigger>
        <TabsTrigger value="audience">Audience</TabsTrigger>
        <TabsTrigger value="creative">Creative</TabsTrigger>
        <TabsTrigger value="budget">Budget & Bidding</TabsTrigger>
      </TabsList>
      
      <TabsContent value="campaigns" className="mt-0">
        <CampaignLevelTable
          accounts={accounts}
          selectedAccount={selectedAccount}
          onSelectAccount={onSelectAccount}
        />
      </TabsContent>
      
      <TabsContent value="adsets" className="mt-0">
        <AdSetLevelTable
          accounts={accounts}
          selectedAccount={selectedAccount}
          onSelectAccount={onSelectAccount}
        />
      </TabsContent>
      
      <TabsContent value="ads" className="mt-0">
        <AdLevelTable
          accounts={accounts}
          selectedAccount={selectedAccount}
          onSelectAccount={onSelectAccount}
        />
      </TabsContent>
      
      <TabsContent value="audience" className="mt-0">
        <MetaAudienceTab />
      </TabsContent>
      
      <TabsContent value="creative" className="mt-0">
        <MetaCreativeTab />
      </TabsContent>
      
      <TabsContent value="budget" className="mt-0">
        <MetaBudgetTab accounts={accounts} />
      </TabsContent>
    </Tabs>
  );
};

export default MetaAdsTabs;
