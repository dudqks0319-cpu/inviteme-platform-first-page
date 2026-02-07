'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getTemplateById } from '@/features/invite/data/templates';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { MapPinIcon, ClockIcon, UserIcon, HeartIcon, BabyIcon, GiftIcon } from 'lucide-react';
import { format } from 'date-fns';

// -----------------------------------------------------------------------------
// Zod Schema Definition
// -----------------------------------------------------------------------------

// Comprehensive schema covering all invite types
const inviteSchema = z.object({
    // Common fields
    title: z.string().min(1, '제목을 입력해주세요'),
    greeting: z.string().min(10, '인사말을 10자 이상 입력해주세요'),
    eventDate: z.string().min(1, '날짜를 선택해주세요'),
    eventTime: z.string().min(1, '시간을 입력해주세요'),
    venueName: z.string().min(1, '장소명을 입력해주세요'),
    venueAddress: z.string().min(1, '주소를 입력해주세요'),

    // Wedding specific
    groomName: z.string().optional(),
    brideName: z.string().optional(),

    // Doljanchi / Birthday specific
    babyName: z.string().optional(),
    babyGender: z.enum(['boy', 'girl']).optional(),
    name: z.string().optional(), // General name for birthday
    age: z.string().optional(),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

export default function InviteCreatePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const templateId = searchParams.get('template');
    const template = templateId ? getTemplateById(templateId) : null;

    // Form setup
    const form = useForm<InviteFormValues>({
        resolver: zodResolver(inviteSchema),
        defaultValues: {
            title: template ? `${template.name} 초대장` : '',
            greeting: '소중한 분들을 모십니다. 부디 오셔서 자리를 빛내주세요.',
            eventDate: format(new Date(), 'yyyy-MM-dd'),
            eventTime: '12:00',
            venueName: '',
            venueAddress: '',
            groomName: '',
            brideName: '',
            babyName: '',
            babyGender: 'boy',
            name: '',
            age: '',
        },
    });

    // Watch form values for real-time preview
    const formValues = form.watch();

    // If no template is found, show error or redirect
    if (!templateId || !template) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h2 className="text-2xl font-bold">템플릿을 찾을 수 없습니다</h2>
                <Button onClick={() => router.push('/en/invite/select')}>
                    템플릿 다시 선택하기
                </Button>
            </div>
        );
    }

    const onSubmit = (data: InviteFormValues) => {
        console.log('Form Submitted:', data);

        // Save to localStorage (mock DB)
        const inviteId = crypto.randomUUID();
        const saveData = {
            id: inviteId,
            templateId: template.id,
            ...data,
            createdAt: new Date().toISOString(),
        };

        // In a real app, we would send this to the backend
        localStorage.setItem(`invite-${inviteId}`, JSON.stringify(saveData));

        // Redirect to preview
        // Note: Since the preview page might expect data from DB, 
        // for this demo we might pass data via query or local storage
        router.push(`/en/invite/preview?id=${inviteId}`);
    };

    // ---------------------------------------------------------------------------
    // Dynamic Field Rendering Helper
    // ---------------------------------------------------------------------------
    const renderDynamicFields = () => {
        switch (template.type) {
            case 'wedding':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="groomName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>신랑 이름</FormLabel>
                                    <FormControl>
                                        <Input placeholder="김신랑" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="brideName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>신부 이름</FormLabel>
                                    <FormControl>
                                        <Input placeholder="이신부" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                );

            case 'doljanchi':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="babyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>아기 이름</FormLabel>
                                    <FormControl>
                                        <Input placeholder="김아기" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Gender selection could be added here */}
                    </div>
                );

            case 'birthday':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>주인공 이름</FormLabel>
                                    <FormControl>
                                        <Input placeholder="홍길동" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>나이 (선택)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="30" type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                );

            default:
                return (
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>주최자 / 주인공</FormLabel>
                                <FormControl>
                                    <Input placeholder="이름" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                );
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* --------------------------------------------------------------------
                                      LEFT COLUMN: FORM
           -------------------------------------------------------------------- */}
                <div className="w-full lg:w-1/2 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">초대장 만들기</h1>
                        <p className="text-muted-foreground">
                            선택하신 <span className="font-semibold text-primary">{template.name}</span>
                            템플릿으로 초대장을 꾸며보세요.
                        </p>
                    </div>

                    <Separator />

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <UserIcon className="w-5 h-5" /> 기본 정보
                                </h3>

                                {renderDynamicFields()}

                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>초대장 제목 (상단 표시)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="결혼합니다" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <ClockIcon className="w-5 h-5" /> 일시 및 장소
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="eventDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>날짜</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="eventTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>시간</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="venueName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>장소명</FormLabel>
                                            <FormControl>
                                                <Input placeholder="예: 신라호텔 영빈관" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="venueAddress"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>상세 주소</FormLabel>
                                            <FormControl>
                                                <Input placeholder="서울시 중구 ..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <HeartIcon className="w-5 h-5" /> 인사말
                                </h3>
                                <FormField
                                    control={form.control}
                                    name="greeting"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="초대하고 싶은 분들에게 마음을 담은 메시지를 작성해주세요."
                                                    className="min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="pt-4 pb-20 lg:pb-0">
                                <Button type="submit" size="lg" className="w-full font-bold text-lg">
                                    초대장 생성완료 ✨
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>

                {/* --------------------------------------------------------------------
                                    RIGHT COLUMN: PREVIEW
           -------------------------------------------------------------------- */}
                <div className="hidden lg:block w-full lg:w-1/2 sticky top-8 h-fit">
                    <div className="bg-slate-100 rounded-3xl p-6 border shadow-inner min-h-[600px] flex justify-center items-center">
                        {/* Mobile Frame Simulation */}
                        <div className="w-[375px] h-[667px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 border-slate-800 relative flex flex-col">

                            {/* Top Notch / Status Bar Area */}
                            <div className="h-8 bg-slate-800 w-full absolute top-0 z-20 flex justify-center">
                                <div className="w-1/3 h-6 bg-black rounded-b-xl"></div>
                            </div>

                            {/* Preview Content - Scrollable */}
                            <div
                                className="flex-1 overflow-y-auto no-scrollbar"
                                style={{
                                    backgroundColor: template.backgroundColor,
                                    fontFamily: template.fontFamily
                                }}
                            >
                                {/* 1. Main Visual Section */}
                                <div
                                    className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center"
                                    style={{ color: template.primaryColor }}
                                >
                                    <p className="text-sm tracking-widest uppercase mb-4 opacity-80">INVITATION</p>

                                    {template.type === 'wedding' && (
                                        <div className="space-y-4 mb-8">
                                            <h2 className="text-3xl font-bold">{formValues.groomName || '신랑'}</h2>
                                            <div className="text-xl">&</div>
                                            <h2 className="text-3xl font-bold">{formValues.brideName || '신부'}</h2>
                                        </div>
                                    )}

                                    {template.type === 'doljanchi' && (
                                        <div className="mb-8">
                                            <BabyIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <h2 className="text-3xl font-bold mb-2">{formValues.babyName || '아기 이름'}</h2>
                                            <p className="text-lg">첫 번째 생일잔치</p>
                                        </div>
                                    )}

                                    {(template.type !== 'wedding' && template.type !== 'doljanchi') && (
                                        <div className="mb-8">
                                            <GiftIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <h2 className="text-3xl font-bold">{formValues.name || '주인공 이름'}</h2>
                                        </div>
                                    )}

                                    <div className="mt-8 space-y-2">
                                        <p className="text-lg">{formValues.eventDate}</p>
                                        <p className="">{formValues.eventTime}</p>
                                        <p className="text-sm mt-4 font-medium opacity-75">{formValues.venueName}</p>
                                    </div>
                                </div>

                                {/* 2. Greeting Section */}
                                <div className="bg-white/80 backdrop-blur-sm p-8 m-4 rounded-xl shadow-sm text-center">
                                    <h3 className="font-bold mb-4 opacity-50 text-xs">인사말</h3>
                                    <p className="whitespace-pre-wrap leading-loose text-sm text-gray-700">
                                        {formValues.greeting || '인사말이 여기에 표시됩니다.'}
                                    </p>
                                </div>

                                {/* 3. Venue Map Placeholer */}
                                <div className="bg-white p-6 m-4 rounded-xl shadow-sm space-y-4">
                                    <div className="flex items-start gap-3">
                                        <MapPinIcon className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-gray-900">{formValues.venueName || '장소명'}</h4>
                                            <p className="text-xs text-gray-500 mt-1">{formValues.venueAddress || '주소가 여기에 표시됩니다'}</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                                        지도 영역 (KakaoMap)
                                    </div>
                                </div>

                            </div>

                            {/* Bottom Action Bar */}
                            <div className="h-16 bg-white border-t flex items-center justify-around px-4 shrink-0 z-10">
                                <Button size="sm" className="w-full rounded-full" style={{ backgroundColor: template.primaryColor }}>
                                    참석 의사 전달하기
                                </Button>
                            </div>

                        </div>
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-4">
                        * 실제 모바일 화면 예시입니다.
                    </p>
                </div>

            </div>
        </div>
    );
}
