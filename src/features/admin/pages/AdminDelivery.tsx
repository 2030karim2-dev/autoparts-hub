import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Truck, Edit, Save } from "lucide-react";
import { deliveryZones as initialZones, currencies as initialCurrencies, yemenExchanges, storeAccounts } from "@/data/yemenData";
import { toast } from "sonner";

const AdminDelivery = () => {
  const [zones, setZones] = useState(initialZones);
  const [currencies, setCurrencies] = useState(initialCurrencies);
  const [editZone, setEditZone] = useState<string | null>(null);
  const [editRates, setEditRates] = useState(false);
  const [zoneForm, setZoneForm] = useState({ fee: "", freeAbove: "", estimatedDays: "" });
  const [rateValues, setRateValues] = useState<Record<string, string>>({});

  const openEditZone = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return;
    setZoneForm({ fee: zone.fee.toString(), freeAbove: zone.freeAbove.toString(), estimatedDays: zone.estimatedDays });
    setEditZone(zoneId);
  };

  const handleSaveZone = () => {
    if (!editZone) return;
    setZones(prev => prev.map(z => z.id === editZone ? { ...z, fee: parseFloat(zoneForm.fee) || z.fee, freeAbove: parseFloat(zoneForm.freeAbove) || z.freeAbove, estimatedDays: zoneForm.estimatedDays || z.estimatedDays } : z));
    toast.success("تم تحديث منطقة التوصيل");
    setEditZone(null);
  };

  const startEditRates = () => {
    const values: Record<string, string> = {};
    currencies.forEach(c => { values[c.code] = c.rate.toString(); });
    setRateValues(values);
    setEditRates(true);
  };

  const handleSaveRates = () => {
    setCurrencies(prev => prev.map(c => ({ ...c, rate: parseFloat(rateValues[c.code]) || c.rate })));
    toast.success("تم تحديث أسعار الصرف");
    setEditRates(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">التوصيل والعملات</h1>
          <p className="text-sm text-muted-foreground mt-1">إدارة مناطق التوصيل وأسعار الصرف والصرافات</p>
        </div>

        <Tabs defaultValue="delivery" className="space-y-4">
          <TabsList className="w-full grid grid-cols-3 h-9">
            <TabsTrigger value="delivery" className="text-xs">🚚 التوصيل</TabsTrigger>
            <TabsTrigger value="currency" className="text-xs">💱 العملات</TabsTrigger>
            <TabsTrigger value="exchanges" className="text-xs">🏦 الصرافات</TabsTrigger>
          </TabsList>

          <TabsContent value="delivery" className="space-y-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">مناطق التوصيل ({zones.length} منطقة)</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead className="text-right">المدينة</TableHead>
                      <TableHead className="text-right">الرسوم</TableHead>
                      <TableHead className="text-right hidden sm:table-cell">مجاني فوق</TableHead>
                      <TableHead className="text-right hidden md:table-cell">المدة</TableHead>
                      <TableHead className="text-right w-16">تعديل</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {zones.map((zone) => (
                        <TableRow key={zone.id}>
                          <TableCell><p className="text-sm font-medium text-foreground">{zone.city}</p><p className="text-[10px] text-muted-foreground">{zone.areas.length} مناطق</p></TableCell>
                          <TableCell className="text-sm font-semibold text-foreground">{zone.fee} ر.س</TableCell>
                          <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{zone.freeAbove} ر.س</TableCell>
                          <TableCell className="hidden md:table-cell"><span className="text-xs text-muted-foreground">{zone.estimatedDays} أيام</span></TableCell>
                          <TableCell><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditZone(zone.id)}><Edit className="h-3.5 w-3.5" /></Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Dialog open={!!editZone} onOpenChange={() => setEditZone(null)}>
              <DialogContent className="max-w-sm" dir="rtl">
                <DialogHeader><DialogTitle>تعديل منطقة التوصيل</DialogTitle></DialogHeader>
                {editZone && (() => {
                  const zone = zones.find(z => z.id === editZone);
                  if (!zone) return null;
                  return (
                    <div className="space-y-4">
                      <div className="text-center p-3 rounded-lg bg-muted/50"><Truck className="h-8 w-8 text-primary mx-auto mb-1" /><p className="font-bold text-foreground">{zone.city}</p></div>
                      <div className="space-y-1.5"><Label className="text-xs">رسوم التوصيل (ر.س)</Label><Input type="number" value={zoneForm.fee} onChange={(e) => setZoneForm(f => ({ ...f, fee: e.target.value }))} /></div>
                      <div className="space-y-1.5"><Label className="text-xs">مجاني فوق (ر.س)</Label><Input type="number" value={zoneForm.freeAbove} onChange={(e) => setZoneForm(f => ({ ...f, freeAbove: e.target.value }))} /></div>
                      <div className="space-y-1.5"><Label className="text-xs">المدة المتوقعة</Label><Input value={zoneForm.estimatedDays} onChange={(e) => setZoneForm(f => ({ ...f, estimatedDays: e.target.value }))} /></div>
                      <Button className="w-full gap-1.5" onClick={handleSaveZone}><Save className="h-4 w-4" /> حفظ</Button>
                    </div>
                  );
                })()}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="currency" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">أسعار الصرف</CardTitle>
                  <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => editRates ? handleSaveRates() : startEditRates()}>
                    {editRates ? <><Save className="h-3 w-3" /> حفظ</> : <><Edit className="h-3 w-3" /> تعديل</>}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {currencies.map((curr) => (
                  <div key={curr.code} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <span className="text-2xl">{curr.flag}</span>
                    <div className="flex-1"><p className="text-sm font-medium text-foreground">{curr.name}</p><p className="text-xs text-muted-foreground">{curr.code}</p></div>
                    {editRates && curr.code !== "SAR" ? (
                      <Input type="number" value={rateValues[curr.code] || ""} onChange={(e) => setRateValues(v => ({ ...v, [curr.code]: e.target.value }))} className="w-24 h-8 text-sm text-left" dir="ltr" />
                    ) : (
                      <div className="text-left"><p className="text-sm font-bold text-foreground">{curr.rate}</p><p className="text-[10px] text-muted-foreground">مقابل 1 ر.س</p></div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exchanges" className="space-y-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">حسابات الصرافات ({yemenExchanges.length})</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {yemenExchanges.map((exchange) => {
                  const account = storeAccounts.find(a => a.exchangeId === exchange.id);
                  return (
                    <div key={exchange.id} className="p-3 rounded-lg border border-border space-y-2">
                      <div className="flex items-center gap-2"><span className="text-lg">{exchange.logo}</span><span className="text-sm font-bold text-foreground">{exchange.name}</span></div>
                      {account && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div><p className="text-muted-foreground">اسم الحساب</p><p className="font-medium text-foreground">{account.accountName}</p></div>
                          <div><p className="text-muted-foreground">رقم الحساب</p><p className="font-mono font-medium text-foreground" dir="ltr">{account.accountNumber}</p></div>
                          <div><p className="text-muted-foreground">الهاتف</p><p className="font-mono font-medium text-foreground" dir="ltr">{account.phone}</p></div>
                        </div>
                      )}
                      <Button variant="outline" size="sm" className="w-full text-xs gap-1" onClick={() => toast.info("سيتم إضافة هذه الميزة مع ربط قاعدة البيانات")}><Edit className="h-3 w-3" /> تعديل البيانات</Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDelivery;
