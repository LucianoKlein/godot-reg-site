import React from "react";
import s from "./page.module.scss";

const POPULAR_COURSES = [
  { id: "poker-1", tab: "扑克", name: "德州扑克基础入门", instructor: "Aiden", duration: "8小时20分", students: 1243 },
  { id: "baccarat-1", tab: "百家乐", name: "百家乐规则与流程", instructor: "Aiden", duration: "4小时10分", students: 2105 },
  { id: "baccarat-3", tab: "百家乐", name: "发牌操作标准训练", instructor: "Leo", duration: "9小时00分", students: 1890 },
  { id: "poker-2", tab: "扑克", name: "锦标赛策略精讲", instructor: "Aiden", duration: "12小时30分", students: 892 },
];

const FAQ_ITEMS = [
  { q: "\u201C面试题目与课程内容一模一样\u201D是怎么做到的？", a: "我们把岗位常见考点与工作流拆解成训练题库与操作标准，并通过模拟练习让你形成可复用的解题/操作框架。" },
  { q: "是否真的\u201C报名后立即签合同\u201D？", a: "会签订正规合同，明确服务范围、流程与条款；具体以你实际签署的合同文本为准。" },
  { q: "\u201C保送/就业支持\u201D具体包含什么？", a: "通常包含训练规划、材料优化建议、面试模拟与流程支持等。不同方案不同内容，建议咨询获取对应清单。" },
  { q: "没有基础能学吗？需要多久？", a: "可以从零开始，但需要按计划投入练习时间。周期与个人基础、执行力和岗位窗口相关。" },
];

const FEATURES = [
  { t: "模拟软件练习", d: "以岗位模拟为核心，让训练更贴近真实工作场景。学会的不只是理论，而是直接上手的能力。" },
  { t: "就业保送服务（全程护航）", d: "从课程到求职，提供系统化支持：简历/面试训练/流程陪跑等（具体服务以合同为准）。" },
  { t: "60+ 课程体系（覆盖面更全）", d: "配套课程与训练内容形成闭环：学—练—测—复盘—再练，直到能稳定交付。" },
  { t: "透明保障：报名即签正规合同", d: "条款清晰、边界明确，杜绝\u201C口头承诺\u201D。你只需要专注努力，其他流程按约推进。" },
  { t: "灵活安排：适配不同节奏", d: "根据实际情况调整训练节奏与安排，让你在能坚持的强度下，把有效练习做足。" },
  { t: "结果导向：每次练习都为面试准备", d: "把面试题型与岗位能力拆解成训练清单：你知道\u201C练什么、练到什么标准、怎么验收\u201D。" },
];

const STEPS = [
  { title: "先对齐目标：岗位能力清单化", text: "明确岗位要什么、面试问什么、现场怎么评估，把目标变成可执行的训练计划。" },
  { title: "再拆解动作：题目→步骤→标准答案结构", text: "不仅给结论，更给\u201C推理路径\u201D和\u201C可复刻的操作流程\u201D。" },
  { title: "高频实战练：重复到稳定", text: "用模拟练习把关键环节练熟，形成稳定输出：会做、做对、做快。" },
  { title: "复盘迭代：从错误中提速", text: "针对弱点定向补强，避免无效刷题，缩短从学习到上岗的距离。" },
];

const JSONLD_ORG = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Aiden 实战训练",
  description: "系统化荷官岗位培训：扑克、百家乐、骰子等课程，含视频录播、笔记讲义与模拟练习。",
  url: typeof window !== "undefined" ? window.location.origin : "",
};

const JSONLD_COURSES = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: POPULAR_COURSES.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Course",
      name: c.name,
      provider: { "@type": "Organization", name: "Aiden 实战训练" },
      instructor: { "@type": "Person", name: c.instructor },
    },
  })),
};

export default function HomeZh() {
  return (
    <div className={s.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD_ORG) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD_COURSES) }} />

      <header className={s.nav}>
        <div className={s.container}>
          <div className={s.navInner}>
            <a href="/zh" className={s.logo} aria-label="Aiden 实战训练 - 首页">
              <div className={s.logoMark} aria-hidden="true" />
              <div>
                <div className={s.logoTitle}>Aiden 实战训练</div>
                <div className={s.logoSub}>不玩套路，只做结果导向</div>
              </div>
            </a>
            <nav className={s.navLinks} aria-label="页面导航">
              <a href="#courses" className={s.navLink}>热门课程</a>
              <a href="#system" className={s.navLink}>教学体系</a>
              <a href="#cases" className={s.navLink}>真实案例</a>
              <a href="#faq" className={s.navLink}>常见问题</a>
              <a href="/zh/courses" className={`${s.btn} ${s.btnGreen}`}>在线课程</a>
              <a href="/zh/quiz" className={`${s.btn} ${s.btnGreen}`}>刷题训练</a>
              <a href="/zh/english" className={`${s.btn} ${s.btnGreen}`}>英语学习</a>
              <a href="#consult" className={`${s.btn} ${s.btnPrimary}`}>立即咨询</a>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className={s.hero}>
          <div className={s.container}>
            <div className={s.heroGrid}>
              <div className={s.heroCard}>
                <div className={s.badgeRow}>
                  <span className={`${s.badge} ${s.badgeBrand}`}>没有套路</span>
                  <span className={`${s.badge} ${s.badgeGreen}`}>实战导向</span>
                  <span className={s.badge}>题目对齐面试</span>
                  <span className={s.badge}>软硬件双保障</span>
                </div>
                <h1 className={s.h1}>只有真正的实力<br />和学员的收获</h1>
                <p className={s.lead}>
                  我们不做"听起来很厉害"的包装，而是把每一次上课与练习都直接对齐真实岗位。
                  目标很明确：让你用<strong>可复用的实战技能</strong>把面试打穿、把工作拿下。
                </p>
                <div className={s.heroActions}>
                  <a href="/zh/courses" className={`${s.btn} ${s.btnGreen}`}>免费试看课程</a>
                  <a href="/zh/quiz" className={`${s.btn} ${s.btnGreen}`}>刷题训练</a>
                  <a href="#consult" className={`${s.btn} ${s.btnPrimary}`}>立即咨询</a>
                  <a href="#cases" className={s.btn}>查看真实案例</a>
                </div>
                <div className={s.miniCardGrid}>
                  <div className={s.miniCard}>
                    <p className={s.miniTitle}>学员反馈关键词</p>
                    <div className={s.miniBig}>务实</div>
                    <p className={s.miniDesc}>面试题与课堂练习高度一致，临场不慌、思路清晰，能按标准交付。</p>
                  </div>
                  <div className={s.miniCard}>
                    <p className={s.miniTitle}>训练的核心</p>
                    <div className={s.miniBig}>会做事</div>
                    <p className={s.miniDesc}>不止"懂"，更强调"能做"。从题目拆解到操作手感，训练到可上岗。</p>
                  </div>
                </div>
              </div>
              <aside className={s.heroCard} aria-label="关键信息卡片">
                <div className={s.asideGrid}>
                  <div className={s.miniCard}>
                    <p className={s.miniTitle}>真实案例</p>
                    <div className={s.miniBig} style={{ fontSize: 20 }}>Sandy 收到 Venetian Offer</div>
                    <p className={s.miniDesc}>从面试到成功上岸，反馈只有两个字：<strong>务实</strong>。</p>
                  </div>
                  <div className={s.miniCard}>
                    <p className={s.miniTitle}>训练支持</p>
                    <div className={s.miniBig} style={{ fontSize: 20 }}>模拟软件练习</div>
                    <p className={s.miniDesc}>用岗位级模拟把关键动作练到"肌肉记忆"，学到的是可直接上手的能力。</p>
                  </div>
                  <div className={s.miniCard}>
                    <p className={s.miniTitle}>服务承诺</p>
                    <div className={s.miniBig} style={{ fontSize: 20 }}>报名即签合同</div>
                    <p className={s.miniDesc}>报名后立即签订正规合同，流程透明、条款清晰，按约履行服务内容。</p>
                  </div>
                  <div className={s.warnCard}>
                    <p className={s.miniTitle} style={{ color: "rgba(255,255,255,0.92)" }}>提醒（重要）</p>
                    <p className={s.miniDesc}>"保送/承诺"等表述以实际签署合同条款为准；个体结果受基础、投入与岗位需求影响。</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ── 热门课程 ── */}
        <section id="courses" className={s.section}>
          <div className={s.container}>
            <div className={s.sectionHeader}>
              <div>
                <h2 className={s.h2}>热门课程</h2>
                <p className={s.sub}>从入门到实战，覆盖扑克、百家乐、骰子等主流岗位，视频录播 + 笔记讲义 + 模拟练习。</p>
              </div>
              <a href="/zh/courses" className={s.btn}>查看全部课程</a>
            </div>
            <div className={s.grid4}>
              {POPULAR_COURSES.map(c => (
                <a key={c.id} href={`/zh/courses/${c.id}`} className={s.courseCard}>
                  <span className={s.courseTab}>{c.tab}</span>
                  <h3 className={s.courseName}>{c.name}</h3>
                  <p className={s.courseMeta}>讲师：{c.instructor} · {c.duration}</p>
                  <p className={s.courseMeta}>{c.students} 人学习</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── 教学体系 ── */}
        <section id="system" className={s.section}>
          <div className={s.container}>
            <div className={s.sectionHeader}>
              <div>
                <h2 className={s.h2}>教学模式：扎实、可复用、可迁移</h2>
                <p className={s.sub}>把脑科学、心理学、教育学与博弈思维融会贯通，让学员用更适合自己的方式学习与练习。</p>
              </div>
            </div>
            <div className={s.grid2}>
              <div className={s.steps}>
                {STEPS.map((item, idx) => (
                  <div key={item.title} className={s.stepItem}>
                    <div className={s.stepNum}>{idx + 1}</div>
                    <div className={s.stepTextWrap}>
                      <p className={s.stepTitle}>{item.title}</p>
                      <p className={s.stepText}>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className={s.quote}>
                <p className={s.quoteText}>"表面看 Aiden 老师是在做训练，但底层是把学习方法、练习系统和面试策略打通。新人在体系带领下，拿到不少有经验的人都未必能拿到的结果。"</p>
                <div className={s.quoteMeta}><span>学员口碑摘要</span><span>关键词：体系化 · 实战化</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 真实案例 ── */}
        <section id="cases" className={s.section}>
          <div className={s.container}>
            <div className={s.sectionHeader}>
              <div>
                <h2 className={s.h2}>真实案例分享</h2>
                <p className={s.sub}>用结果和过程说话：从"怎么练"到"怎么答"，把面试拆解成可训练的动作。</p>
              </div>
              <a href="#consult" className={s.btn}>获取同款训练路径</a>
            </div>
            <div className={s.grid2}>
              <div className={s.quote}>
                <p className={s.quoteText}>"当面试的时候，发现题目竟然是你们课上讲过并要求练习的内容！我心里一点都不慌！"</p>
                <div className={s.quoteMeta}><span>学员反馈</span><span>题目对齐 · 可复现</span></div>
              </div>
              <div className={s.quote}>
                <p className={s.quoteText}>"相信 Aiden 老师您是个做实事的人，其他学校根本没有这样的实力！"</p>
                <div className={s.quoteMeta}><span>学员反馈</span><span>落地 · 结果导向</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 课程与保障 ── */}
        <section id="features" className={s.section}>
          <div className={s.container}>
            <div className={s.sectionHeader}>
              <div>
                <h2 className={s.h2}>独家软硬件双重保障</h2>
                <p className={s.sub}>手把手把"真实岗位问题"变成"可训练、可考核、可上岗"的能力。</p>
              </div>
            </div>
            <div className={s.grid3}>
              {FEATURES.map(f => (
                <div key={f.t} className={s.feature}>
                  <div className={s.featureTitle}>{f.t}</div>
                  <p className={s.featureText}>{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className={s.section}>
          <div className={s.container}>
            <div className={s.sectionHeader}>
              <div>
                <h2 className={s.h2}>常见问题</h2>
                <p className={s.sub}>你关心的，我们直接讲清楚，避免信息不对称。</p>
              </div>
            </div>
            <div className={s.grid2}>
              {FAQ_ITEMS.map(item => (
                <div key={item.q} className={s.feature}>
                  <div className={s.featureTitle}>{item.q}</div>
                  <p className={s.featureText}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA（精简，去掉假表单） ── */}
        <section id="consult" className={s.cta}>
          <div className={s.container}>
            <div className={s.ctaCard}>
              <span className={s.badge} style={{ display: "inline-block", margin: 0 }}>选择值得信赖的学校 · 结果交付</span>
              <h3 className={s.ctaTitle} style={{ marginTop: 10 }}>现在咨询：获取课程方案 + 就业服务细节 + 合同条款说明</h3>
              <p className={s.ctaText}>我们不搞虚的，只做实的。你只需要专注努力，把训练做扎实；剩下的流程，我们按约推进。</p>
              <div className={s.ctaActions}>
                <a href="/zh/courses" className={`${s.btn} ${s.btnGreen}`}>免费试看课程</a>
                <a href="#consult" className={`${s.btn} ${s.btnPrimary}`}>立即私信/咨询</a>
                <a href="#cases" className={s.btn}>回看案例</a>
              </div>
              <div className={s.note}>备注：页面文案中涉及"保送/承诺/唯一"等表述，以合同与实际服务能力为准。</div>
            </div>
          </div>
        </section>

        <footer className={s.footer}>
          <div className={s.container}>
            <div className={s.footerInner}>
              <div>
                <div className={s.footerBrand}>Aiden 实战训练</div>
                <div className={s.footerCopy}>© {new Date().getFullYear()} All rights reserved.</div>
              </div>
              <div className={s.footerRight}>
                <div className={s.footerContact}>联系：请在此处填写公众号/微信号/邮箱/电话</div>
                <div className={s.footerLinks}>
                  <a href="/zh/courses" className={s.footerLink}>在线课程</a>
                  <span className={s.footerSep}>|</span>
                  <a href="/zh/quiz" className={s.footerLink}>刷题训练</a>
                  <span className={s.footerSep}>|</span>
                  <a href="#consult" className={s.footerLink}>咨询通道</a>
                  <span className={s.footerSep}>|</span>
                  <a href="#faq" className={s.footerLink}>常见问题</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}