"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="secondary" className="text-xs">
      {children}
    </Badge>
  );
}

function Endpoint({
  method,
  path,
  mime,
}: {
  method: "GET" | "POST";
  path: string;
  mime?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className={
          method === "POST"
            ? "bg-green-500/10 text-green-500 border-green-500/20"
            : "bg-blue-500/10 text-blue-500 border-blue-500/20"
        }
      >
        {method}
      </Badge>
      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
        {path}
      </code>
      {mime && <Badge variant="outline">{mime}</Badge>}
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <Alert className="bg-emerald-500/10 border-emerald-500/20 text-emerald-500">
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </section>
  );
}

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      // no-op
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="absolute top-2 right-2 h-7 text-xs"
        onClick={onCopy}
      >
        {copied ? "Copied" : "Copy"}
      </Button>
      <ScrollArea className="h-full max-h-[300px] rounded-lg border bg-muted p-4">
        <pre className="text-sm">
          <code>{code}</code>
        </pre>
      </ScrollArea>
    </div>
  );
}

export default function Page() {
  const [activeId, setActiveId] = useState<string>("overview");
  const toc = useMemo(
    () => [
      { id: "overview", label: "Overview" },
      { id: "base", label: "Base URL" },
      { id: "auth", label: "Authentication" },
      { id: "types", label: "Money & Types" },
      { id: "create-payment", label: "Create Payment" },
      { id: "payout", label: "Customer Payout" },
      { id: "status", label: "HTTP Status Codes" },
      { id: "callbacks", label: "Callbacks" },
      { id: "security", label: "Security Notes" },
      { id: "openapi", label: "OpenAPI Spec" },
    ],
    []
  );

  // Track section in view
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("section[id]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.getAttribute("id");
            if (id) setActiveId(id);
          }
        });
      },
      { rootMargin: "0px 0px -75% 0px", threshold: 0.1 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // --- Code samples (kept here to keep JSX readable) ---
  const baseUrl = "https://api.zeonixpay.com";
  const authHeaders = String.raw`API-KEY: <YOUR_API_KEY>
SECRET-KEY: <YOUR_SECRET_KEY>`;
  const curlCreate = String.raw`curl -X POST "https://api.zeonixpay.com/api/v1/payment/create/" \
  -H "API-KEY: YOUR_API_KEY" \
  -H "SECRET-KEY: YOUR_SECRET_KEY" \
  -F "customer_order_id=8888" \
  -F "customer_name=Samim" \
  -F "customer_number=017765656565" \
  -F "customer_amount=500.00" \
  -F "customer_email=demo@gmail.com" \
  -F "customer_address=234/3, North Uttara, Dhaka." \
  -F "method=bkash" \
  -F "callback_url=https://merchant.example.com/payments/callback"`;

  const resp200 = String.raw`{
  "statusMessage": "Successful",
  "paymentID": "f88d406bf3264831abec092bef100073",
  "paymentURL": "https://pay.zeonixpay.com/payment/?invoice_payment_id=f88d406bf3264831abec092bef100073",
  "callbackURL": "https://merchant.example.com/payments/callback",
  "successCallbackURL": "https://zeonixpay.com/?invoice_payment_id=f88d406bf3264831abec092bef100073&paymentStatus=success",
  "failureCallbackURL": "https://zeonixpay.com/?invoice_payment_id=f88d406bf3264831abec092bef100073&paymentStatus=failure",
  "cancelledCallbackURL": "https://zeonixpay.com/?invoice_payment_id=f88d406bf3264831abec092bef100073&paymentStatus=cancel",
  "amount": "500.00",
  "paymentCreateTime": "2025-08-27 06:30:01.173608+00:00",
  "transactionStatus": "Initiated",
  "merchantInvoiceNumber": "399797"
}`;

  const payoutPayload = String.raw`{
  "receiver_name": "Samim",
  "receiver_number": "0177666884",
  "amount": "100.00",
  "payment_method": "bkash",
  "payment_details": "{\"account_name\":\"Samim\",\"account_number\":\"0177666884\"}"
}`;

  const curlPayout = String.raw`curl -X POST "https://api.zeonixpay.com/api/v1/payment/payout/" \
  -H "API-KEY: YOUR_API_KEY" \
  -H "SECRET-KEY: YOUR_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "receiver_name": "Samim",
    "receiver_number": "0177666884",
    "amount": "100.00",
    "payment_method": "bkash",
    "payment_details": "{\"account_name\":\"Samim\",\"account_number\":\"0177666884\"}"
  }'`;

  const resp201 = String.raw`{
  "status": true,
  "payoutID": "50ac235d6c954a9cbaa237db4414b394",
  "method": "bkash",
  "amount": "100.00",
  "payoutCreateTime": "2025-08-27 07:04:35.775465+00:00",
  "transactionStatus": "pending",
  "merchantId": "399797"
}`;

  const openapi = String.raw`openapi: 3.0.3
info:
  title: ZeonixPay Payment Gateway API
  version: "1.0"
servers:
  - url: https://api.zeonixpay.com
paths:
  /api/v1/payment/create/:
    post:
      summary: Create a payment session
      description: Returns a hosted paymentURL for the customer to complete payment.
      parameters:
        - in: header
          name: API-KEY
          schema: { type: string }
          required: true
        - in: header
          name: SECRET-KEY
          schema: { type: string }
          required: true
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/PaymentCreateRequest'
      responses:
        "200":
          description: Successful
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaymentCreateResponse'
        "400": { description: Bad Request }
        "401": { description: Unauthorized }
        "403": { description: Forbidden }
        "429": { description: Too Many Requests }
        "500": { description: Server Error }
  /api/v1/payment/payout/:
    post:
      summary: Create a customer payout
      parameters:
        - in: header
          name: API-KEY
          schema: { type: string }
          required: true
        - in: header
          name: SECRET-KEY
          schema: { type: string }
          required: true
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PayoutRequest'
      responses:
        "201":
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PayoutResponse'
        "400": { description: Bad Request }
        "401": { description: Unauthorized }
        "403": { description: Forbidden }
        "429": { description: Too Many Requests }
        "500": { description: Server Error }
components:
  schemas:
    PaymentCreateRequest:
      type: object
      required: [customer_order_id, customer_name, customer_number, customer_amount]
      properties:
        customer_order_id: { type: string, example: "8888" }
        customer_name: { type: string, example: "Samim" }
        customer_number: { type: string, example: "017765656565" }
        customer_amount: { type: string, example: "500.00" }
        customer_email: { type: string, format: email, example: "demo@gmail.com" }
        customer_address: { type: string, example: "234/3, North Uttara, Dhaka." }
        method:
          type: string
          example: bkash
          enum: [bkash, nagad, rocket, bkash-personal, nagad-personal, rocket-personal]
        callback_url:
          type: string
          format: uri
          example: https://merchant.example.com/payments/callback
    PaymentCreateResponse:
      type: object
      properties:
        statusMessage: { type: string, example: "Successful" }
        paymentID: { type: string, example: "f88d406bf3264831abec092bef100073" }
        paymentURL:
          type: string
          format: uri
          example: "https://pay.zeonixpay.com/payment/?invoice_payment_id=f88d406bf3264831abec092bef100073"
        callbackURL: { type: string, format: uri }
        successCallbackURL: { type: string, format: uri }
        failureCallbackURL: { type: string, format: uri }
        cancelledCallbackURL: { type: string, format: uri }
        amount: { type: string, example: "500.00" }
        paymentCreateTime: { type: string, example: "2025-08-27 06:30:01.173608+00:00" }
        transactionStatus: { type: string, example: "Initiated" }
        merchantInvoiceNumber: { type: string, example: "399797" }
    PayoutRequest:
      type: object
      required: [receiver_name, receiver_number, amount, payment_method, payment_details]
      properties:
        receiver_name: { type: string, example: "Samim" }
        receiver_number: { type: string, example: "0177666884" }
        amount: { type: string, example: "100.00" }
        payment_method:
          type: string
          example: bkash
          enum: [bkash, nagad, rocket, bkash-personal, nagad-personal, rocket-personal]
        payment_details:
          type: string
          description: JSON string with method-specific fields.
          example: '{"account_name":"Samim","account_number":"0177666884"}'
    PayoutResponse:
      type: object
      properties:
        status: { type: boolean, example: true }
        payoutID: { type: string, example: "50ac235d6c954a9cbaa237db4414b394" }
        method: { type: string, example: "bkash" }
        amount: { type: string, example: "100.00" }
        payoutCreateTime: { type: string, example: "2025-08-27 07:04:35.775465+00:00" }
        transactionStatus: { type: string, example: "pending" }
        merchantId: { type: string, example: "399797" }`;

  return (
    <div className="pl-4 bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-25">
            <Image src="/zeonix-logo.png" width={200} height={32} alt="zeonix-logo" />
            <div>
              <h1 className="text-2xl font-bold leading-none tracking-tight">
                Payment Gateway API
              </h1>
              <div className="text-sm text-muted-foreground mt-3">
                Last updated: 2025-08-27 11:16 • Timezone: Asia/Dhaka
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className=" py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* TOC */}
          <aside className="md:w-64 flex-shrink-0">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-lg">Contents</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="">
                  <div className="p-4 space-y-1">
                    {toc.map((item) => (
                      <Button
                        key={item.id}
                        variant={activeId === item.id ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => {
                          document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                          setActiveId(item.id);
                        }}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </aside>

          {/* Content */}
          <div className="flex-1">
            <ScrollArea className="h-[calc(100vh-140px)]">
              <div className="pr-4">
                <Section id="overview" title="Overview">
                  <p className="text-muted-foreground">
                    Clean, concise endpoints for taking customer payments and
                    sending payouts. Keep keys server-side. Use the hosted{" "}
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                      paymentURL
                    </code>{" "}
                    to collect funds securely.
                  </p>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 mt-4">
                    <div>
                      <Pill>Environment</Pill>
                      <div className="text-muted-foreground text-sm mt-1">
                        Base URL below
                      </div>
                    </div>
                    <div>
                      <Pill>Auth</Pill>
                      <div className="text-muted-foreground text-sm mt-1">
                        <code>API-KEY</code> + <code>SECRET-KEY</code> headers
                      </div>
                    </div>
                    <div>
                      <Pill>Formats</Pill>
                      <div className="text-muted-foreground text-sm mt-1">
                        JSON, multipart form-data
                      </div>
                    </div>
                  </div>
                </Section>

                <Section id="base" title="Base URL">
                  <CodeBlock code={baseUrl} />
                </Section>

                <Section id="auth" title="Authentication">
                  <p className="text-muted-foreground">
                    Send both headers with <em>every</em> request:
                  </p>
                  <CodeBlock code={authHeaders} />
                  <Note>
                    Bottom line: don&apos;t ship these keys in browsers or mobile apps.
                  </Note>
                </Section>

                <Section id="types" title="Money & Types">
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>
                      Amounts are strings with 2 decimals, e.g.{" "}
                      <code>&apos;500.00&apos;</code>.
                    </li>
                    <li>
                      Phone numbers are strings (local format or E.164 if you
                      prefer).
                    </li>
                    <li>Timestamps are timezone-aware (ISO 8601 style).</li>
                  </ul>
                </Section>

                <Section id="create-payment" title="Create Payment">
                  <div className="mb-3">
                    <Endpoint
                      method="POST"
                      path="/api/v1/payment/create/"
                      mime="multipart/form-data"
                    />
                  </div>
                  <p className="text-muted-foreground">
                    Creates a payment session and returns a hosted{" "}
                    <code>paymentURL</code> for the customer.
                  </p>

                  <h3 className="mt-4 mb-2 text-lg font-semibold">Headers</h3>
                  <CodeBlock code={authHeaders} />

                  <h3 className="mt-5 mb-2 text-lg font-semibold">Form fields</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Field</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Required</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          [
                            "customer_order_id",
                            "string",
                            "Yes",
                            "Your internal order ID.",
                          ],
                          ["customer_name", "string", "Yes", "Customer name."],
                          ["customer_number", "string", "Yes", "Customer phone."],
                          ["customer_amount", "string", "Yes", 'e.g. "500.00"'],
                          ["customer_email", "string", "No", "Optional."],
                          ["customer_address", "string", "No", "Optional."],
                          [
                            "method",
                            "string",
                            "No",
                            "Preferred method: bkash, nagad, rocket, bkash-personal, nagad-personal, rocket-personal.",
                          ],
                          [
                            "callback_url",
                            "string (URL)",
                            "No",
                            "Your server endpoint to receive status updates.",
                          ],
                        ].map(([f, t, r, n]) => (
                          <TableRow key={f as string}>
                            <TableCell className="font-medium">
                              <code>{f}</code>
                            </TableCell>
                            <TableCell>{t}</TableCell>
                            <TableCell>{r}</TableCell>
                            <TableCell>{n}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <h3 className="mt-5 mb-2 text-lg font-semibold">cURL</h3>
                  <CodeBlock code={curlCreate} />

                  <h3 className="mt-5 mb-2 text-lg font-semibold">200 OK — Response</h3>
                  <CodeBlock code={resp200} />

                  <Note>
                    Redirect your customer to <code>paymentURL</code>. Store
                    <code> paymentID</code> for reconciliation.
                  </Note>
                </Section>

                <Section id="payout" title="Customer Payout">
                  <div className="mb-3">
                    <Endpoint
                      method="POST"
                      path="/api/v1/payment/payout/"
                      mime="application/json"
                    />
                  </div>
                  <p className="text-muted-foreground">
                    Create an outgoing payout to a receiver.
                  </p>

                  <h3 className="mt-4 mb-2 text-lg font-semibold">Headers</h3>
                  <CodeBlock
                    code={String.raw`${authHeaders}
Content-Type: application/json`}
                  />

                  <h3 className="mt-5 mb-2 text-lg font-semibold">Request body</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Field</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Required</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          ["receiver_name", "string", "Yes", "Recipient's name."],
                          [
                            "receiver_number",
                            "string",
                            "Yes",
                            "Wallet/phone number.",
                          ],
                          ["amount", "string", "Yes", 'e.g. "100.00"'],
                          [
                            "payment_method",
                            "string",
                            "Yes",
                            "bkash, nagad, rocket, or personal variants.",
                          ],
                          [
                            "payment_details",
                            "string (JSON as string)",
                            "Yes",
                            "Method-specific fields.",
                          ],
                        ].map(([f, t, r, n]) => (
                          <TableRow key={f as string}>
                            <TableCell className="font-medium">
                              <code>{f}</code>
                            </TableCell>
                            <TableCell>{t}</TableCell>
                            <TableCell>{r}</TableCell>
                            <TableCell>{n}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <h3 className="mt-5 mb-2 text-lg font-semibold">Example payload</h3>
                  <CodeBlock code={payoutPayload} />

                  <h3 className="mt-5 mb-2 text-lg font-semibold">cURL</h3>
                  <CodeBlock code={curlPayout} />

                  <h3 className="mt-5 mb-2 text-lg font-semibold">201 Created — Response</h3>
                  <CodeBlock code={resp201} />
                </Section>

                <Section id="status" title="HTTP Status Codes">
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>
                      <strong>200 OK</strong> — Request succeeded (e.g., payment
                      created).
                    </li>
                    <li>
                      <strong>201 Created</strong> — Resource created (e.g.,
                      payout).
                    </li>
                    <li>
                      <strong>400 Bad Request</strong> — Missing/invalid fields.
                    </li>
                    <li>
                      <strong>401 Unauthorized</strong> — Bad/missing keys.
                    </li>
                    <li>
                      <strong>403 Forbidden</strong> — Keys valid but not allowed.
                    </li>
                    <li>
                      <strong>404 Not Found</strong> — Resource doesn&apos;t exist.
                    </li>
                    <li>
                      <strong>409 Conflict</strong> — Duplicate order ID or similar.
                    </li>
                    <li>
                      <strong>429 Too Many Requests</strong> — Rate‑limit hit.
                    </li>
                    <li>
                      <strong>500/503 Server Error</strong> — Retry with backoff.
                    </li>
                  </ul>
                </Section>

                <Section id="callbacks" title="Callbacks">
                  <p className="text-muted-foreground">
                    Provide a single <code>callback_url</code> for Create Payment.
                    Your server should accept status notifications for success,
                    failure, or cancel.
                  </p>
                  <Note>
                    Verify incoming callbacks (IP allowlist or signatures if
                    provided). Update your order idempotently by
                    <code> paymentID</code> or <code>customer_order_id</code>.
                  </Note>
                </Section>

                <Section id="security" title="Security Notes">
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Never expose keys in client apps.</li>
                    <li>Redact logs. Mask phone numbers if needed.</li>
                    <li>Validate inbound callbacks: method, path, params.</li>
                  </ul>
                </Section>

                <Section id="openapi" title="OpenAPI 3.0 (Minimal)">
                  <Tabs defaultValue="preview">
                    <TabsList>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                      <TabsTrigger value="code">YAML</TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview">
                      <Alert>
                        <AlertDescription>
                          Drop the YAML into Swagger UI or Postman to explore.
                        </AlertDescription>
                      </Alert>
                    </TabsContent>
                    <TabsContent value="code">
                      <CodeBlock code={openapi} language="yaml" />
                    </TabsContent>
                  </Tabs>
                </Section>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}